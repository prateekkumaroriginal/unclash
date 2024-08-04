"use client";

import { Plus } from "lucide-react";
import ChannelItem from "./ChannelItem";
import { ChannelType, MemberRole } from "@prisma/client";
import { ActionTooltip } from "../action-tooltip";
import { useModal } from "@/hooks/use-modal-store";
import { serverWithMembersWithProfiles } from "@/lib/types";

interface serverChannelSectionProps {
    name: string;
    type: ChannelType;
    role?: MemberRole;
    server: serverWithMembersWithProfiles;
    data: {
        id: string;
        name: string;
        icon: React.ReactNode;
    }[]
}

const ServerChannelSection = ({
    name,
    type,
    role,
    server,
    data
}: serverChannelSectionProps) => {
    const { onOpen } = useModal();

    return (
        <div>
            <div className="flex items-center justify-between py-2">
                <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                    {name}
                </p>

                {role !== MemberRole.GUEST && (
                    <ActionTooltip label={`Create ${type} Channel`} side="top" align="center">
                        <button
                            onClick={() => onOpen("createChannel", { server, channelType: type })}
                            className="ml-auto text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                        >
                            <Plus className="h-4 w-4" />
                        </button>
                    </ActionTooltip>
                )}
            </div>

            <div className="flex flex-col">
                {data.map(({ id, name }) => (
                    <ChannelItem
                        key={id}
                        id={id}
                        name={name}
                        type={type}
                        role={role}
                    />
                ))}
            </div>
        </div>
    );
}

export default ServerChannelSection;