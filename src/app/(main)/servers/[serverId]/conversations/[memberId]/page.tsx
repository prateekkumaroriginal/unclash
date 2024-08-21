import ChatHeader from "@/components/chat/ChatHeader";
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
    const otherMember = profile.id === memberOne.profile.id ? memberTwo : memberOne;

    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader
                name={otherMember.profile.name}
                imageUrl={otherMember.profile.imageUrl}
                serverId={params.serverId}
                type="conversation"
            />
        </div>
    );
}

export default MemberIdPage;