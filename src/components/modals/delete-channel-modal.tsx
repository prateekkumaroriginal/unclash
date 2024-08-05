"use client";

import { useForm } from "react-hook-form";
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
import { Form } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { ChannelType } from "@prisma/client";
import { Hash, Mic, Video } from "lucide-react";

const iconMap = {
    [ChannelType.TEXT]: Hash,
    [ChannelType.AUDIO]: Mic,
    [ChannelType.VIDEO]: Video
}

export const DeleteChannelModal = () => {
    const router = useRouter();
    const { type, isOpen, data, onClose } = useModal();

    const { server, channelData, channelType } = data;

    const Icon = iconMap[channelType || ChannelType.TEXT];

    const isModalOpen = isOpen && type === "deleteChannel";

    const form = useForm();

    const { handleSubmit, formState: { isSubmitting, isValid } } = form;

    const onSubmit = async () => {
        try {
            const response = await axios.delete(`/api/servers/${server?.id}/channels/${channelData?.id}`);
            if (response.status === 200) {
                router.refresh();
                onClose();
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#f1f1f1] text-black py-8 px-6 dark:bg-[#1f1f23] dark:text-white">
                <DialogHeader>
                    <DialogTitle className="text-3xl font-semibold text-center">Delete Channel</DialogTitle>
                    <DialogDescription className="text-zinc-500">
                        Are you sure you want to permanently delete <span className="text-indigo-500 font-semibold">
                            <Icon className="h-4 w-4 inline-flex text-indigo-500" />
                            {" "}
                            {channelData?.name}
                        </span>? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4">
                    <Form {...form}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <DialogFooter className="flex flex-row justify-center items-center">
                                <Button
                                    onClick={onClose}
                                    type="button"
                                    variant="outline"
                                    className="w-1/2"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="destructive"
                                    className="w-1/2"
                                    disabled={isSubmitting || !isValid}
                                >
                                    Delete
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}