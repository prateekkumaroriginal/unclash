import { currentProfile } from "@/lib/current-profile";
import db from "@/lib/db";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";
import ServerHeader from "@/components/server/ServerHeader";

interface serverSidebarProps {
    serverId: string
}

const ServerSidebar = async ({ serverId }: serverSidebarProps) => {
    const { profile, redirectToSignIn } = await currentProfile();
    if (!profile) {
        return redirectToSignIn();
    }

    const server = await db.server.findUnique({
        where: {
            id: serverId
        },
        include: {
            channels: {
                orderBy: {
                    createdAt: "asc"
                }
            },
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

    const textChannels = server?.channels.filter(channel => channel.type === ChannelType.TEXT);
    const audioChannels = server?.channels.filter(channel => channel.type === ChannelType.AUDIO);
    const videoChannels = server?.channels.filter(channel => channel.type === ChannelType.VIDEO);
    const members = server?.members;

    if (!server) {
        return redirect("/");
    }

    const role = members?.find(member => member.profileId === profile.id)?.role;

    return (
        <div className="sm:hidden md:flex flex-col fixed inset-y-0 w-60 z-20 bg-[#f2f3f5] dark:bg-[#2b2d31]">
            <ServerHeader
                server={server}
                role={role}
            />

        </div>
    );
}

export default ServerSidebar;