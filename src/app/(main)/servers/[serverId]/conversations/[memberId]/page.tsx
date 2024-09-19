import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessages from "@/components/chat/ChatMessages";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import db from "@/lib/db";
import { redirect } from "next/navigation";

interface MemberIdPageProps {
    params: {
        serverId: string;
        memberId: string;
    }
}

const MemberIdPage = async ({ params }: MemberIdPageProps) => {
    const { profile, redirectToSignIn } = await currentProfile();
    if (!profile) {
        return redirectToSignIn();
    }

    const currentMember = await db.member.findFirst({
        where: {
            serverId: params.serverId,
            profileId: profile.id
        },
        include: {
            profile: true
        }
    });

    if (!currentMember) {
        return redirect("/");
    }

    const conversation = await getOrCreateConversation(currentMember.id, params.memberId);
    if (!conversation) {
        return redirect(`/servers/${params.serverId}`);
    }

    const { memberOne, memberTwo } = conversation;
    const otherMember = profile.id === memberOne.profile.id ? memberOne : memberTwo;

    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader
                name={otherMember.profile.name}
                imageUrl={otherMember.profile.imageUrl}
                serverId={params.serverId}
                type="conversation"
            />

            <ChatMessages
                name={otherMember.profile.name}
                type="conversation"
                apiUrl="/api/directMessages"
                chatId={conversation.id}
                socketUrl="/api/socket/directMessages"
                member={currentMember}
                paramKey="conversationId"
                paramValue={conversation.id}
                socketQuery={{
                    conversationId: conversation.id
                }}
            />

            <ChatInput
                apiUrl="/api/socket/directMessages"
                name={otherMember.profile.name}
                type="conversation"
                query={{
                    conversationId: conversation.id
                }}
            />
        </div>
    );
}

export default MemberIdPage;