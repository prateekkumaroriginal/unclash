"use client";

import { cn } from "@/lib/utils";
import { MemberRole } from "@prisma/client";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { memberWithProfile } from "@/lib/types";
import UserAvatar from "@/components/user-avatar";

interface channelItemProps {
    member: memberWithProfile;
}

const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 text-indigo-500" />,
    [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 text-emerald-700" />
}

const MemberItem = ({ member }: channelItemProps) => {
    const router = useRouter();
    const params = useParams();

    return (
        <button
            className={cn(
                "group p-2 rounded-md flex gap-x-1 items-center w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
                params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700"
            )}
        >
            <UserAvatar
                src={member.profile.imageUrl}
                className="h-6 w-6 md:h-6 md:w-6"
            />

            <span>
                {roleIconMap[member.role]}
            </span>

            <p
                className={cn(
                    "line-clamp-1 break-all font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
                    params?.memberId === member.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
                )}
            >
                {member.profile.name}
            </p>
        </button>
    );
}

export default MemberItem;