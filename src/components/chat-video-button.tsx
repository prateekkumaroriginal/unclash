"use client";

import { Video, VideoOff } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ActionTooltip } from "./action-tooltip";
import qs from "query-string";

const ChatVideoButton = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const isVideo = searchParams?.get("video");

    const Icon = isVideo ? VideoOff : Video;
    const tooltipLabel = isVideo ? "End video call" : "Start a video call";

    const onClick = () => {
        const url = qs.stringifyUrl({
            url: pathname || "",
            query: {
                video: isVideo ? undefined : true
            }
        }, { skipNull: true });

        router.push(url);
    }

    return (
        <ActionTooltip
            label={tooltipLabel}
            align="center"
            side="top"
        >
            <button
                onClick={onClick}
                className="hover:opacity-75 transition mr-4"
            >
                <Icon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
            </button>
        </ActionTooltip>
    );
}

export default ChatVideoButton;