"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Copy, RefreshCcw } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import axios from "axios";

export const InviteModal = () => {
    const { type, isOpen, onOpen, onClose, data } = useModal();
    const { server } = data;
    const origin = useOrigin();
    const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

    const isModalOpen = isOpen && type === "invite";

    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const onCopy = () => {
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 1000);
    }

    const onNew = async () => {
        try {
            setIsLoading(true);
            const response = await axios.patch(`/api/servers/${server?.id}/invite-code`);
            if (response.status === 200) {
                onOpen("invite", { server: response.data });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#f1f1f1] text-black py-8 px-6 dark:bg-[#1f1f23] dark:text-white">
                <DialogHeader>
                    <DialogTitle className="text-3xl font-semibold text-center">Invite Friends</DialogTitle>
                </DialogHeader>

                <div className="p-6">
                    <div className="flex items-center justify-center space-x-4">
                        <Label className="font-bold text-zinc-800 dark:text-zinc-500">
                            Server Invite Link
                        </Label>
                        <Button
                            onClick={onNew}
                            disabled={isLoading}
                            variant="link"
                            className="h-fit w-fit"
                            size="icon"
                        >
                            <RefreshCcw className="h-4 w-4 text-zinc-800 dark:text-zinc-500" />
                        </Button>
                    </div>
                    <div className="flex items-center mt-2 gap-x-2">
                        <Input
                            disabled={isLoading}
                            className="bg-zinc-400/50 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0"
                            value={inviteUrl}
                        />
                        <Button
                            disabled={isLoading}
                            onClick={onCopy}
                            className="bg-zinc-400/50 hover:bg-zinc-400/70 dark:bg-zinc-700/50 dark:hover:bg-zinc-700/70"
                            size="icon"
                        >
                            {
                                copied
                                    ? <Check className="h-4 w-4 text-black dark:text-white" />
                                    : <Copy className="h-4 w-4 text-black dark:text-white" />
                            }

                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}