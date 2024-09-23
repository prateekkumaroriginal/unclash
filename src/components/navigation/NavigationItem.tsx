"use client";

import { ActionTooltip } from "@/components/action-tooltip";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

interface navigationItemProps {
    name: string,
    id: string,
    imageUrl: string
}

const NavigationItem = ({
    name,
    id,
    imageUrl
}: navigationItemProps) => {
    const params = useParams();
    const serverId = typeof params?.serverId === "string" ? params.serverId : null;

    return (
        <div className="mb-4 relative flex items-center">
            <div className="z-20 absolute left-0 w-1 h-10" />
            <Link
                href={`/servers/${id}`}
                className="group flex items-center mx-3"
            >
                <div
                    className={cn(
                        "absolute left-0 bg-[#1e1f22] dark:bg-white w-1 rounded-r-full transition-all",
                        serverId === id ? "h-10" : "h-2",
                        serverId !== id && "group-hover:h-5"
                    )}
                />
                <ActionTooltip
                    label={name}
                    side="right"
                    align="center"
                >
                    <div className={cn(
                        "flex h-12 w-12 rounded-3xl group-hover:rounded-2xl bg-background group-hover:bg-indigo-500 items-center justify-center overflow-hidden transition-all",
                        serverId === id && "rounded-2xl"
                    )}>
                        <Image
                            src={imageUrl}
                            alt="Server"
                            width={48}
                            height={48}
                        />
                    </div>
                </ActionTooltip>
            </Link>
        </div>
    );
}

export default NavigationItem;