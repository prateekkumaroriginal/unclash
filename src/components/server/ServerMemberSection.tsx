"use client";

import { Cog } from "lucide-react";
import { MemberRole } from "@prisma/client";
import { ActionTooltip } from "@/components/action-tooltip";
import { useModal } from "@/hooks/use-modal-store";
import { memberWithProfile, serverWithMembersWithProfiles } from "@/lib/types";
import MemberItem from "@/components/server/MemberItem";

interface serverMemberSectionProps {
    name: string;
    role: MemberRole;
    server: serverWithMembersWithProfiles;
    members: memberWithProfile[];
}

const ServerMemberSection = ({
    name,
    role,
    server,
    members
}: serverMemberSectionProps) => {
    const { onOpen } = useModal();

    return (
        <div>
            <div className="flex items-center justify-between py-2">
                <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                    {name}
                </p>

                {role !== MemberRole.GUEST && (
                    <ActionTooltip label="Manage Members" side="top" align="center">
                        <button
                            onClick={() => onOpen("members", { server })}
                            className="ml-auto text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                        >
                            <Cog className="h-4 w-4" />
                        </button>
                    </ActionTooltip>
                )}
            </div>

            <div className="flex flex-col">
                {members.map((member) => (
                    <MemberItem
                        key={member.id}
                        member={member}
                    />
                ))}
            </div>
        </div>
    );
}

export default ServerMemberSection;