import { memberWithProfile } from "@/lib/types";
import { Member, MemberRole } from "@prisma/client";
import UserAvatar from "../user-avatar";
import { ActionTooltip } from "../action-tooltip";
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import qs from "query-string";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios from "axios";
import { useModal } from "@/hooks/use-modal-store";
import { useRouter } from "next/navigation";

interface ChatItemProps {
    id: string;
    content: string;
    member: memberWithProfile;
    timestamp: string;
    fileUrl: string | null;
    deleted: boolean;
    currentMember: Member;
    isUpdated: boolean;
    socketUrl: string;
    socketQuery: Record<string, string>;
}

const roleIconMap = {
    "GUEST": null,
    "MODERATOR": <ShieldCheck className="h-5 w-5 text-indigo-500" />,
    "ADMIN": <ShieldAlert className="h-5 w-5 text-emerald-700" />
}

const formSchema = z.object({
    content: z.string().min(1)
});

const ChatItem = ({
    id,
    content,
    member,
    timestamp,
    fileUrl,
    deleted,
    currentMember,
    isUpdated,
    socketUrl,
    socketQuery
}: ChatItemProps) => {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const { onOpen } = useModal();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content
        }
    });

    const { handleSubmit, reset, control, formState: { isSubmitting } } = form;

    useEffect(() => {
        reset({
            content
        });
    }, [content]);

    useEffect(() => {
        const handleKeydown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsEditing(false);
            }
        }

        window.addEventListener("keydown", handleKeydown);

        return () => window.removeEventListener("keydown", handleKeydown);
    }, []);

    const onMemberClick = () => {
        if (currentMember.id !== member.id) {
            router.push(`/servers/${currentMember.serverId}/conversations/${member.id}`);
        }
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: `${socketUrl}/${id}`,
                query: socketQuery
            });

            await axios.patch(url, values);
            setIsEditing(false);
        } catch (error) {
            console.log(error);
        }
    }

    const fileType = fileUrl?.split(".").pop();

    const isAdmin = currentMember.role === MemberRole.ADMIN;
    const isModerator = currentMember.role === MemberRole.MODERATOR;
    const isOwner = currentMember.id === member.id;
    const isDeletable = !deleted && (isAdmin || isModerator || isOwner);
    const isEditable = !deleted && !fileUrl && isOwner;
    const isPdf = fileUrl && fileType === "pdf";
    const isImage = fileUrl && !isPdf;

    return (
        <div className="relative group w-full flex items-center hover:bg-black/10 p-4 transition">
            <div className="group flex gap-x-2 items-start w-full">
                <div
                    onClick={onMemberClick}
                    className="cursor-pointer hover:drop-shadow-md transition"
                >
                    <UserAvatar
                        src={member.profile.imageUrl}
                        className="h-6 w-6"
                    />
                </div>

                <div className="flex flex-col w-full">
                    <div className="flex items-center gap-x-2">
                        <div className="flex items-center gap-x-2">
                            <p
                                onClick={onMemberClick}
                                className="font-semibold text-sm hover:underline cursor-pointer text-zinc-600 dark:text-zinc-400"
                            >
                                {member.profile.name}
                            </p>
                            <ActionTooltip label={member.role}>
                                {roleIconMap[member.role]}
                            </ActionTooltip>
                        </div>

                        <span className="text-xs whitespace-pre-wrap text-zinc-600 dark:text-zinc-400">
                            {timestamp}
                        </span>

                        {isUpdated && !deleted && (
                            <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                                (Edited)
                            </span>
                        )}
                    </div>

                    {isImage && (
                        <a
                            href={fileUrl}
                            rel="noopener noreferrer"
                            target="_blank"
                            className="relative aspect-square h-48 w-48 mt-2 rounded-sm flex overflow-hidden items-center bg-secondary"
                        >
                            <Image
                                src={fileUrl}
                                alt={content}
                                fill
                                className="object-cover"
                            />
                        </a>
                    )}

                    {isPdf && (
                        <div className="relative flex items-center p-2 mt-2 rounded-md bg-slate-300/40 dark:bg-slate-500/30">
                            <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
                            <a
                                href={fileUrl}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
                            >
                                PDF File
                            </a>
                        </div>
                    )}

                    {!fileUrl && !isEditing && (
                        <p className={cn(
                            "text-sm text-zinc-800 dark:text-zinc-200",
                            deleted && "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
                        )}>
                            {content}
                        </p>
                    )}

                    {!fileUrl && isEditing && (
                        <Form {...form}>
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="flex w-full items-center gap-x-2 pt-2"
                            >
                                <FormField
                                    control={control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <div className="relative w-full">
                                                    <Input
                                                        {...field}
                                                        disabled={isSubmitting}
                                                        className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200 dark:placeholder:text-zinc-200/40 placeholder:text-zinc-600/40"
                                                        placeholder="Edited Message"
                                                    />
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <Button size="sm" variant="primary" disabled={isSubmitting}>
                                    Save
                                </Button>
                            </form>
                            <span className="text-[10px] mt-1 text-zinc-400">
                                Press Esc to cancel, Enter to save
                            </span>
                        </Form>
                    )}
                </div>
            </div>

            {isDeletable && (
                <div className="hidden group-hover:flex absolute items-center gap-x-2 p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
                    {isEditable && (
                        <ActionTooltip label="Edit">
                            <Edit
                                onClick={() => setIsEditing(true)}
                                className="cursor-pointer ml-auto h-4 w-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                            />
                        </ActionTooltip>
                    )}
                    <ActionTooltip label="Delete">
                        <Trash
                            onClick={() => onOpen("deleteMessage", {
                                apiUrl: `${socketUrl}/${id}`,
                                query: socketQuery
                            })}
                            className="cursor-pointer ml-auto h-4 w-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                        />
                    </ActionTooltip>
                </div>
            )}
        </div>
    );
}

export default ChatItem;