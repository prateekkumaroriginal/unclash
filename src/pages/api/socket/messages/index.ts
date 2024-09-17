import { currentProfilePages } from "@/lib/current-profile-pages";
import db from "@/lib/db";
import { NextApiResponseServerIO } from "@/lib/types";
import { NextApiRequest } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const profile = await currentProfilePages(req);
        const { content, fileUrl } = req.body;
        const { serverId, channelId } = req.query;

        if (!profile) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!serverId) {
            return res.status(400).json({ message: "Server Id missing" });
        }

        if (!channelId) {
            return res.status(400).json({ message: "Channel Id missing" });
        }

        if (!content) {
            return res.status(400).json({ message: "Content missing" });
        }

        const server = await db.server.findUnique({
            where: {
                id: serverId as string,
                members: {
                    some: {
                        profileId: profile.id
                    }
                }
            },
            include: {
                members: true
            }
        });

        if (!server) {
            return res.status(404).json({ message: "Server not found" });
        }

        const channel = await db.channel.findUnique({
            where: {
                id: channelId as string,
                serverId: serverId as string
            }
        });

        if (!channel) {
            return res.status(404).json({ message: "Channel not found" });
        }

        const member = server.members.find((member) => member.profileId === profile.id);
        const message = await db.message.create({
            data: {
                content,
                fileUrl,
                channelId: channelId as string,
                memberId: member!.id
            },
            include: {
                member: {
                    include: {
                        profile: true
                    }
                }
            }
        });

        const channelKey = `channel:${channelId}:messages`;
        res.socket.server.io.emit(channelKey, message);

        return res.json(message);
    } catch (error) {
        console.log("[MESSAGES_POST]", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}