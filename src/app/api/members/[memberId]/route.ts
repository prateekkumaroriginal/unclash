import { currentProfile } from "@/lib/current-profile";
import db from "@/lib/db";
import { roleChangeProps } from "@/lib/zod-props";
import { NextResponse } from "next/server";


export async function PATCH(
    req: Request,
    { params }: { params: { memberId: string } }
) {
    try {
        const { profile } = await currentProfile();
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get("serverId");

        const body = await req.json();

        const parsedInput = roleChangeProps.safeParse(body);
        if (!parsedInput.success) {
            return NextResponse.json(
                { message: parsedInput.error },
                { status: 400 }
            );
        }

        if (!serverId) {
            return new NextResponse("Server Id missing", { status: 400 });
        }

        if (!params.memberId) {
            return new NextResponse("Member Id missing", { status: 400 });
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id
            },
            data: {
                members: {
                    update: {
                        where: {
                            id: params.memberId,
                            profileId: {
                                not: profile.id
                            }
                        },
                        data: {
                            role: parsedInput.data.role
                        }
                    }
                }
            },
            include: {
                members: {
                    include: {
                        profile: true
                    },
                    orderBy: {
                        role: "asc"
                    }
                }
            }
        });

        return NextResponse.json(server);
    } catch (error) {
        console.log("[MEMBERS_ID_PATCH]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { memberId: string } }
) {
    try {
        const { profile } = await currentProfile();
        if (!profile) {
            return NextResponse.json("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get("serverId");

        if (!serverId) {
            return NextResponse.json("Server Id Missing", { status: 400 });
        }

        if (!params.memberId) {
            return NextResponse.json("Member Id Missing", { status: 400 });
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id
            },
            data: {
                members: {
                    delete: {
                        id: params.memberId,
                        profileId: {
                            not: profile.id
                        }
                    }
                }
            },
            include: {
                members: {
                    include: {
                        profile: true
                    },
                    orderBy: {
                        role: "asc"
                    }
                }
            }
        });

        return NextResponse.json(server);
    } catch (error) {
        console.log("[MEMBER_ID_DELETE]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}