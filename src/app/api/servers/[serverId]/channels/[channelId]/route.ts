import { currentProfile } from "@/lib/current-profile";
import db from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params }: { params: { serverId: string, channelId: string } }
) {
    try {
        const { profile } = await currentProfile();
        if (!profile) {
            return NextResponse.json("Unauthorized", { status: 401 });
        }

        if (!params.serverId) {
            return new NextResponse("Server Id missing", { status: 400 });
        }

        if (!params.channelId) {
            return new NextResponse("Channel Id missing", { status: 400 });
        }

        const server = await db.server.update({
            where: {
                id: params.serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data: {
                channels: {
                    delete: {
                        id: params.channelId
                    }
                }
            }
        });

        return NextResponse.json(server);
    } catch (error) {
        console.log("[CHANNEL_ID_DELETE]", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}