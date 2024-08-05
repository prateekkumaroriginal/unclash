import { currentProfile } from "@/lib/current-profile";
import db from "@/lib/db";
import { channelCreationProps } from "@/lib/zod-props";
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

        await db.server.update({
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

        return new NextResponse("Channel Deleted", { status: 200 });
    } catch (error) {
        console.log("[CHANNEL_ID_DELETE]", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}

export async function PATCH(
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

        const body = await req.json();
        const parsedInput = channelCreationProps.safeParse(body);
        if (!parsedInput.success) {
            return NextResponse.json(
                { message: parsedInput.error },
                { status: 400 }
            );
        }

        const { name, type } = parsedInput.data;

        await db.server.update({
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
                    update: {
                        where: {
                            id: params.channelId
                        },
                        data: {
                            name,
                            type
                        }
                    }
                }
            }
        });

        return new NextResponse("Channel Updated", { status: 200 });
    } catch (error) {
        console.log("[CHANNEL_ID_PATCH]", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}