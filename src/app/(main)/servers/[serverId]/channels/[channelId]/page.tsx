import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessages from "@/components/chat/ChatMessages";
import MediaRoom from "@/components/media-room";
import { currentProfile } from "@/lib/current-profile";
import db from "@/lib/db";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";

interface ChannelIdPageProps {
    params: {
        serverId: string;
        channelId: string;
    }
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
    const { profile, redirectToSignIn } = await currentProfile();
    if (!profile) {
        redirectToSignIn();
    }

    const channel = await db.channel.findUnique({
        where: {
            id: params.channelId
        }
    });

    const member = await db.member.findFirst({
        where: {
            serverId: params.serverId,
            profileId: profile?.id
        }
    });

    if (!channel || !member) {
        return redirect("/");
    }

    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader
                name={channel.name}
                serverId={params.serverId}
                type="channel"
            />

            {channel.type === ChannelType.TEXT && (
                <>
                    <ChatMessages
                        name={channel.name}
                        chatId={channel.id}
                        member={member}
                        apiUrl="/api/messages"
                        socketUrl="/api/socket/messages"
                        socketQuery={{
                            channelId: channel.id,
                            serverId: channel.serverId
                        }}
                        paramKey="channelId"
                        paramValue={channel.id}
                        type="channel"
                    />

                    <ChatInput
                        apiUrl="/api/socket/messages"
                        name={channel.name}
                        type="channel"
                        query={{
                            channelId: channel.id,
                            serverId: channel.serverId
                        }}
                    />
                </>
            )}

            {channel.type === ChannelType.AUDIO && (
                <MediaRoom
                    roomId={channel.id}
                    video={false}
                    audio={true}
                />
            )}

            {channel.type === ChannelType.VIDEO && (
                <MediaRoom
                    roomId={channel.id}
                    video={true}
                    audio={true}
                />
            )}
        </div>
    );
}

export default ChannelIdPage;