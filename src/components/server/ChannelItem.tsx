"use client";

import { cn } from "@/lib/utils";
import { ChannelType, MemberRole } from "@prisma/client";
import { Edit, Hash, Lock, Mic, Trash2, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ActionTooltip } from "@/components/action-tooltip";
import { modalType, useModal } from "@/hooks/use-modal-store";
import { serverWithMembersWithProfiles } from "@/lib/types";

interface channelItemProps {
    id: string;
    name: string;
    type: ChannelType;
    server: serverWithMembersWithProfiles;
    role?: MemberRole;
}

const iconMap = {
    [ChannelType.TEXT]: Hash,
    [ChannelType.AUDIO]: Mic,
    [ChannelType.VIDEO]: Video
}

const ChannelItem = ({
    id,
    name,
    type,
    server,
    role
}: channelItemProps) => {
    const router = useRouter();
    const params = useParams();
    const { onOpen } = useModal();

    const Icon = iconMap[type];

    const onClick = () => {
        return router.push(`/servers/${params?.serverId}/channels/${id}`);
    }

    const onAction = (e: React.MouseEvent, action: modalType) => {
        e.stopPropagation();
        onOpen(action, { server, channelType: type, channelData: { id, name } });
    }

    return (
        <button
            onClick={onClick}
            className={cn(
                "group p-2 rounded-md flex gap-x-2 items-center w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
                params?.channelId === id && "bg-zinc-700/20 dark:bg-zinc-700"
            )}
        >
            <span>
                <Icon className="h-4 w-4 flex-shrink-0 text-zinc-500 dark:text-zinc-400" />
            </span>

            <p
                className={cn(
                    "line-clamp-1 break-all font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
                    params?.channelId === id && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
                )}
            >
                {name}
            </p>

            {name !== "general" && role !== MemberRole.GUEST && (
                <div className="ml-auto flex items-center gap-x-2">
                    <ActionTooltip label="Edit" side="top" align="center">
                        <Edit
                            onClick={(e) => onAction(e, "editChannel")}
                            className="hidden group-hover:block h-4 w-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                        />
                    </ActionTooltip>
                    <ActionTooltip label="Delete" side="top" align="center">
                        <Trash2
                            onClick={(e) => onAction(e, "deleteChannel")}
                            className="hidden group-hover:block h-4 w-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                        />
                    </ActionTooltip>
                </div>
            )}

            {name === "general" && <Lock
                className="h-4 w-4 ml-auto text-zinc-500 dark:text-zinc-400"
            />}
        </button>
    );
}

export default ChannelItem;