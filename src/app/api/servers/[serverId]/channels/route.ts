import { currentProfile } from "@/lib/current-profile";
import db from "@/lib/db";
import { channelCreationProps } from "@/lib/zod-props";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { serverId: string } }
) {
    try {
        const { profile } = await currentProfile();
        if (!profile) {
            return NextResponse.json("Unauthorized", { status: 401 });
        }

        if (!params.serverId) {
            return new NextResponse("Server Id missing", { status: 400 });
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
                    create: {
                        name,
                        type,
                        profileId: profile.id
                    }
                }
            }
        });

        return NextResponse.json(server);
    } catch (error) {
        console.log("[CHANNEL_POST]", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}