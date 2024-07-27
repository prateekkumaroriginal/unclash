"use client";

import { useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { useModal } from "@/hooks/use-modal-store";
import { serverWithMembersWithProfiles } from "@/lib/types";
import { ChannelType } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { channelCreationProps } from "@/lib/zod-props";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios from "axios";
import { z } from "zod";

export const CreateChannelModal = () => {
    const router = useRouter();
    const { type, isOpen, onOpen, onClose, data } = useModal();
    const { server } = data as { server: serverWithMembersWithProfiles };

    const isModalOpen = isOpen && type === "createChannel";

    const form = useForm({
        resolver: zodResolver(channelCreationProps),
        defaultValues: {
            name: "",
            type: ChannelType.TEXT
        }
    });

    const { handleSubmit, control, reset, formState: { isSubmitting } } = form;

    const onSubmit = async (values: z.infer<typeof channelCreationProps>) => {
        try {
            const response = await axios.post(`/api/servers/${server.id}/channels`, values);

            if (response.status === 200) {
                reset();
                router.refresh();
                onClose();
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleClose = () => {
        onClose();
        reset();
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-[#f1f1f1] text-black py-8 px-6 dark:bg-[#1f1f23] dark:text-white">
                <DialogHeader>
                    <DialogTitle className="text-3xl font-semibold text-center">Create Channel</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-8 mt-8">
                            <FormField
                                control={control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel>Channel Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isSubmitting}
                                                placeholder="New Channel..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel>Channel Type</FormLabel>
                                        <Select
                                            disabled={isSubmitting}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.values(ChannelType).map(channelType => (
                                                    <SelectItem
                                                        key={channelType}
                                                        value={channelType}
                                                    >
                                                        {channelType}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter className="flex flex-row justify-center items-center pt-8">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-full"
                                    disabled={isSubmitting}
                                >
                                    Create
                                </Button>
                            </DialogFooter>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}