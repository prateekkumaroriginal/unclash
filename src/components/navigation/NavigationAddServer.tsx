"use client";

import { ActionTooltip } from "@/components/action-tooltip";
import { useModal } from "@/hooks/use-modal-store";
import { Plus } from "lucide-react";

const NavigationAddServer = () => {
    const { onOpen } = useModal();

    return (
        <ActionTooltip
            label="Add a Server"
            side="right"
            align="center"
        >
            <button
                onClick={() => onOpen("createServer")}
                className="group flex items-center mx-3"
            >
                <div className="flex h-12 w-12 rounded-3xl group-hover:rounded-2xl bg-background group-hover:bg-indigo-500 items-center justify-center overflow-hidden transition-all">
                    <Plus className="h-6 w-6 text-indigo-500 group-hover:text-[#f2f2f2] transition" />
                </div>
            </button>
        </ActionTooltip>
    );
}

export default NavigationAddServer;