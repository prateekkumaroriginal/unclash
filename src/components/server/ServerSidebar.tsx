import { currentProfile } from "@/lib/current-profile";
import db from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import ServerHeader from "@/components/server/ServerHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import ServerSearch from "@/components/server/ServerSearch";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import ServerChannelSection from "@/components/server/ServerChannelSection";
import ServerMemberSection from "@/components/server/ServerMemberSection";

interface serverSidebarProps {
    serverId: string
}

const channelIconMap = {
    [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
    [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
    [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />
}

const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />,
    [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-emerald-700" />
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
    const members = server?.members.filter(member => member.profileId !== profile.id);

    if (!server) {
        return redirect("/");
    }

    const role = server.members.find(member => member.profileId === profile.id)?.role;
    if (!role) {
        return null;
    }

    return (
        <div className="invisible md:visible md:flex flex-col fixed inset-y-0 w-60 z-20 bg-[#f2f3f5] dark:bg-[#2b2d31]">
            <ServerHeader
                server={server}
                role={role}
            />

            <ScrollArea className="flex-1 px-3">
                <div className="mt-2">
                    <ServerSearch
                        data={[
                            {
                                label: "Text Channels",
                                type: "channel",
                                data: textChannels?.map(channel => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: channelIconMap[channel.type]
                                }))
                            },
                            {
                                label: "Voice Channels",
                                type: "channel",
                                data: audioChannels?.map(channel => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: channelIconMap[channel.type]
                                }))
                            },
                            {
                                label: "Video Channels",
                                type: "channel",
                                data: videoChannels?.map(channel => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: channelIconMap[channel.type]
                                }))
                            },
                            {
                                label: "Members",
                                type: "member",
                                data: members?.map(member => ({
                                    id: member.id,
                                    name: member.profile.name,
                                    icon: roleIconMap[member.role]
                                }))
                            },
                        ]}
                    />
                </div>

                <Separator className="h-[2px] rounded-md bg-zinc-300 dark:bg-zinc-700 w-full mx-auto my-2" />

                <div>
                    {!!textChannels?.length && <ServerChannelSection
                        name="TEXT CHANNELS"
                        type={ChannelType.TEXT}
                        role={role}
                        server={server}
                        data={textChannels?.map(channel => ({
                            id: channel.id,
                            name: channel.name,
                            icon: channelIconMap[channel.type]
                        }))}
                    />}
                    {!!audioChannels?.length && <ServerChannelSection
                        name="VOICE CHANNELS"
                        type={ChannelType.AUDIO}
                        role={role}
                        server={server}
                        data={audioChannels?.map(channel => ({
                            id: channel.id,
                            name: channel.name,
                            icon: channelIconMap[channel.type]
                        }))}
                    />}
                    {!!videoChannels?.length && <ServerChannelSection
                        name="VIDEO CHANNELS"
                        type={ChannelType.VIDEO}
                        role={role}
                        server={server}
                        data={videoChannels?.map(channel => ({
                            id: channel.id,
                            name: channel.name,
                            icon: channelIconMap[channel.type]
                        }))}
                    />}
                    {!!members?.length && <ServerMemberSection
                        name="MEMBERS"
                        role={role}
                        server={server}
                        members={members}
                    />}
                </div>
            </ScrollArea>
        </div>
    );
}

export default ServerSidebar;