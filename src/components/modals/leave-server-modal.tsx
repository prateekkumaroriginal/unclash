"use client";

import axios from "axios";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { serverWithMembersWithProfiles } from "@/lib/types";

export const LeaveServerModal = () => {
    const router = useRouter();
    const { type, isOpen, data, onClose } = useModal();

    const { server } = data as { server: serverWithMembersWithProfiles };

    const isModalOpen = isOpen && type === "leaveServer";

    const onSubmit = async () => {
        try {
            const response = await axios.patch(`/api/servers/${server.id}/leave`);
            if (response.status === 200) {
                router.refresh();
                onClose();
                router.push("/");
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#f1f1f1] text-black py-8 px-6 dark:bg-[#1f1f23] dark:text-white">
                <DialogHeader>
                    <DialogTitle className="text-3xl font-semibold text-center">Leave Server</DialogTitle>
                    <DialogDescription className="text-zinc-500">
                        Are you sure you want to leave <span className="text-indigo-500 font-semibold">
                            {server?.name}
                        </span>? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4">
                    <DialogFooter className="flex flex-row justify-center items-center">
                        <Button
                            onClick={onClose}
                            type="button"
                            variant="outline"
                            className="w-1/2"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={onSubmit}
                            type="button"
                            variant="destructive"
                            className="w-1/2"
                        >
                            Leave
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}