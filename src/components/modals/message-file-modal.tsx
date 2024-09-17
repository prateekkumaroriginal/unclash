"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import qs from "query-string";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
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
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";

const formSchema = z.object({
    fileUrl: z.string().url()
});

export const MessageFileModal = () => {
    const router = useRouter();
    const { isOpen, onOpen, onClose, type, data } = useModal();

    const { apiUrl, query } = data;

    const isModalOpen = isOpen && type === "messageFile";

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fileUrl: ""
        }
    });

    const { handleSubmit, control, reset, formState: { isSubmitting } } = form;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: apiUrl || "",
                query
            });
            await axios.post(url, {
                ...values,
                content: values.fileUrl
            });
            reset();
            router.refresh();
            handleClose();
        } catch (error) {
            console.log(error);
        }
    }

    const handleClose = () => {
        reset();
        onClose();
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-[#f1f1f1] text-black py-8 px-6 dark:bg-[#1f1f23] dark:text-white">
                <DialogHeader>
                    <DialogTitle className="text-3xl font-semibold text-center">Add an attachment</DialogTitle>
                    <DialogDescription className="text-zinc-500">
                        Send a file as a message
                    </DialogDescription>
                </DialogHeader>

                <div>
                    <Form {...form}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="space-y-8">
                                <div className="flex items-center justify-center">
                                    <FormField
                                        control={control}
                                        name="fileUrl"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <FileUpload
                                                        endpoint={"messageFile"}
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <DialogFooter className="flex flex-row justify-center items-center pt-8">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-full"
                                    disabled={isSubmitting}
                                >
                                    Send
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}