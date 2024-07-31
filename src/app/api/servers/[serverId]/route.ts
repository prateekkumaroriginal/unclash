import { currentProfile } from "@/lib/current-profile";
import db from "@/lib/db";
import { serverCreationProps } from "@/lib/zod-props";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { serverId: string } }
) {
    try {
        const { profile } = await currentProfile();
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!params.serverId) {
            return new NextResponse("Server Id missing", { status: 400 });
        }

        const body = await req.json();
        const parsedInput = serverCreationProps.safeParse(body);
        if (!parsedInput.success) {
            return NextResponse.json(
                { message: parsedInput.error },
                { status: 400 }
            );
        }

        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: profile.id
            },
            data: {
                name: parsedInput.data.name,
                imageUrl: parsedInput.data.imageUrl
            }
        });

        return NextResponse.json(server);
    } catch (error) {
        console.log("[SERVER_ID_PATCH]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { serverId: string } }
) {
    try {
        const { profile } = await currentProfile();
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!params.serverId) {
            return new NextResponse("Server Id missing", { status: 400 });
        }

        const server = await db.server.delete({
            where: {
                id: params.serverId,
                profileId: profile.id
            }
        });

        return NextResponse.json(server);
    } catch (error) {
        console.log("[SERVER_ID_DELETE]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}