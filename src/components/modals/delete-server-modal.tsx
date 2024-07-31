"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { serverWithMembersWithProfiles } from "@/lib/types";
import { useEffect } from "react";

const confirmationProps = z.object({
    serverName: z.string(),
    confirm: z.string()
}).refine((data) => data.serverName === data.confirm, {
    message: "Write server name in the input box.",
    path: ["confirm"]
});

export const DeleteServerModal = () => {
    const router = useRouter();
    const { type, isOpen, data, onClose } = useModal();

    const { server } = data as { server: serverWithMembersWithProfiles };

    const isModalOpen = isOpen && type === "deleteServer";

    const form = useForm({
        resolver: zodResolver(confirmationProps),
        defaultValues: {
            serverName: server?.name,
            confirm: ""
        }
    });

    const { handleSubmit, control, reset, formState: { isSubmitting, isValid } } = form;

    const onSubmit = async () => {
        try {
            const response = await axios.delete(`/api/servers/${server.id}`);
            if (response.status === 200){
                router.refresh();
                onClose();
                router.push("/");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleClose = () => {
        onClose();
        reset();
    }

    useEffect(() => {
        if (server) {
            form.setValue("serverName", server.name);
        }
    }, [server]);

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-[#f1f1f1] text-black py-8 px-6 dark:bg-[#1f1f23] dark:text-white">
                <DialogHeader>
                    <DialogTitle className="text-3xl font-semibold text-center">Delete Server</DialogTitle>
                    <DialogDescription className="text-zinc-500">
                        Are you sure you want to permanently delete <span className="text-indigo-500 font-semibold">
                            {server?.name}
                        </span>? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4">
                    <Form {...form}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <FormField
                                name="confirm"
                                control={control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                disabled={isSubmitting}
                                                placeholder="Type server name here"
                                                autoComplete="off"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter className="flex flex-row justify-center items-center pt-8">
                                <Button
                                    onClick={handleClose}
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