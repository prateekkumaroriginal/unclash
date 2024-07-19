import { currentProfile } from "@/lib/current-profile";
import db from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { serverCreationProps } from "@/lib/zod-props";

export async function POST(req: Request) {
    try {
        const profile = await currentProfile();
        if (!profile) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        const body = await req.json();
        const parsedInput = serverCreationProps.safeParse(body);
        if (!parsedInput.success) {
            return NextResponse.json(
                { message: parsedInput.error },
                { status: 400 }
            );
        }

        const { name, imageUrl } = parsedInput.data;
        const server = await db.server.create({
            data: {
                profileId: profile.id,
                name,
                imageUrl,
                inviteCode: uuidv4(),
                channels: {
                    create: {
                        name: "general",
                        profileId: profile.id,
                        type: ChannelType.TEXT
                    }
                },
                members: {
                    create: {
                        role: MemberRole.ADMIN,
                        profileId: profile.id
                    }
                }
            }
        });

        return NextResponse.json(server);
    } catch (error) {
        console.log("[SERVERS_POST]", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
