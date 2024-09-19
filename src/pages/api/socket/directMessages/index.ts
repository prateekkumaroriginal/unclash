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
        const { conversationId } = req.query;

        if (!profile) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!conversationId) {
            return res.status(400).json({ message: "Server Id missing" });
        }

        if (!content) {
            return res.status(400).json({ message: "Content missing" });
        }

        const conversation = await db.conversation.findUnique({
            where: {
                id: conversationId as string,
                OR: [
                    {
                        memberOne: {
                            profileId: profile.id
                        }
                    },
                    {
                        memberTwo: {
                            profileId: profile.id
                        }
                    }
                ]
            },
            include: {
                memberOne: {
                    include: {
                        profile: true
                    }
                },
                memberTwo: {
                    include: {
                        profile: true
                    }
                }
            }
        });

        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }

        const member = conversation.memberOne.profile.id === profile.id ? conversation.memberOne : conversation.memberTwo;
        const directMessage = await db.directMessage.create({
            data: {
                content,
                fileUrl,
                conversationId: conversationId as string,
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

        const channelKey = `conversation:${conversationId}:messages`;
        res.socket.server.io.emit(channelKey, directMessage);

        return res.json(directMessage);
    } catch (error) {
        console.log("[DIRECT_MESSAGES_POST]", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}