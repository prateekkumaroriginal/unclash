"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import { Input } from "@/components/ui/input";
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
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { serverCreationProps } from "@/lib/zod-props";

export const InitialModal = () => {
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(serverCreationProps),
        defaultValues: {
            name: "",
            imageUrl: ""
        }
    });

    const { handleSubmit, control, reset, formState: { isSubmitting } } = form;

    const onSubmit = async (values: z.infer<typeof serverCreationProps>) => {
        try {
            await axios.post("/api/servers", values);
            reset();
            router.refresh();
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Dialog open>
            <DialogContent className="bg-[#f1f1f1] text-black py-8 px-6 dark:bg-[#1f1f23] dark:text-white">
                <DialogHeader>
                    <DialogTitle className="text-3xl font-semibold text-center">Create your own Server</DialogTitle>
                    <DialogDescription className="text-zinc-500">
                        Make your server unique by giving it an awesome name and a cool image. You can change it later.
                    </DialogDescription>
                </DialogHeader>

                <div>
                    <Form {...form}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="space-y-8">
                                <div className="flex items-center justify-center">
                                    <FormField
                                        control={control}
                                        name="imageUrl"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <FileUpload
                                                        endpoint={"serverImage"}
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel>Server Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={isSubmitting}
                                                    placeholder="My Awesome Server..."
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

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
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}