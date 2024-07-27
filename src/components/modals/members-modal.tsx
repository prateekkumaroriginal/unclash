"use client";

import { useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuTrigger,
    DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";

import { useModal } from "@/hooks/use-modal-store";
import { serverWithMembersWithProfiles } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import UserAvatar from "@/components/user-avatar";
import { Check, DiamondMinus, Loader2, MoreVertical, Shield, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";
import { ActionTooltip } from "@/components/action-tooltip";
import { MemberRole } from "@prisma/client";
import qs from "query-string";
import axios from "axios";
import { useRouter } from "next/navigation";

const roleIconMap = {
    "GUEST": null,
    "MODERATOR": <ShieldCheck className="h-5 w-5 text-indigo-500" />,
    "ADMIN": <ShieldAlert className="h-5 w-5 text-emerald-700" />
}

export const MembersModal = () => {
    const router = useRouter();
    const { type, isOpen, onOpen, onClose, data } = useModal();
    const { server } = data as { server: serverWithMembersWithProfiles };

    const [loadingId, setLoadingId] = useState("");

    const isModalOpen = isOpen && type === "members";

    const onKick = async (memberId: string) => {
        try {
            setLoadingId(memberId);
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    serverId: server?.id
                }
            });

            const response = await axios.delete(url);

            if (response.status === 200) {
                router.refresh();
                onOpen("members", { server: response.data });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingId("");
        }
    }

    const onRoleChange = async (memberId: string, role: MemberRole) => {
        try {
            setLoadingId(memberId);
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    serverId: server?.id
                }
            });

            const response = await axios.patch(url, { role });

            if (response.status === 200) {
                router.refresh();
                onOpen("members", { server: response.data });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingId("");
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#f1f1f1] text-black py-8 px-6 dark:bg-[#1f1f23] dark:text-white">
                <DialogHeader>
                    <DialogTitle className="text-3xl font-semibold text-center">Manage Members</DialogTitle>
                    <DialogDescription
                        className="text-center"
                    >
                        {server?.members?.length} members
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="mt-8 max-h-[420px] pr-6">
                    {server?.members?.map(member => (
                        <div
                            key={member.id}
                            className="flex items-center gap-x-4 mb-6"
                        >
                            <UserAvatar src={member.profile.imageUrl} />
                            <div className="flex flex-col">
                                <div className="flex items-center gap-x-2 line-clamp-1">
                                    {member.profile.name}
                                    <ActionTooltip
                                        label={member.role}
                                        side="top"
                                    >
                                        {roleIconMap[member.role]}
                                    </ActionTooltip>
                                </div>
                                <p className="text-zinc-500 text-xs">
                                    {member.profile.email}
                                </p>
                            </div>

                            {server.profileId !== member.profileId && loadingId !== member.id &&
                                <div className="ml-auto">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <MoreVertical className="h-4 w-4 my-1 text-zinc-500" />
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent side="right" align="start">
                                            <div className="w-full text-center text-xs text-zinc-500 mb-2">
                                                {member.profile.name}
                                            </div>
                                            <DropdownMenuSub>
                                                <DropdownMenuSubTrigger className="cursor-pointer">
                                                    <ShieldQuestion className="h-4 w-4 mr-2" />
                                                    <span>Role</span>
                                                </DropdownMenuSubTrigger>

                                                <DropdownMenuPortal>
                                                    <DropdownMenuSubContent className="ml-2">
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                onRoleChange(member.id, MemberRole.GUEST)
                                                            }}
                                                            className="cursor-pointer"
                                                        >
                                                            <Shield className="h-4 w-4 mr-2" />
                                                            <div className="pr-2">
                                                                Guest
                                                            </div>
                                                            {member.role === MemberRole.GUEST && (
                                                                <Check className="h-4 w-4 ml-auto" />
                                                            )}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                onRoleChange(member.id, MemberRole.MODERATOR)
                                                            }}
                                                            className="cursor-pointer"
                                                        >
                                                            <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />
                                                            <div className="pr-2">
                                                                Moderator
                                                            </div>
                                                            {member.role === MemberRole.MODERATOR && (
                                                                <Check className="h-4 w-4 ml-auto" />
                                                            )}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuSubContent>
                                                </DropdownMenuPortal>
                                            </DropdownMenuSub>

                                            <DropdownMenuSeparator />

                                            <DropdownMenuItem
                                                onClick={() => {
                                                    onKick(member.id)
                                                }}
                                                className="cursor-pointer text-red-500 focus:bg-red-500 focus:text-white"
                                            >
                                                <DiamondMinus className="h-4 w-4 mr-2" />
                                                Kick
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            }
                            {loadingId === member.id && (
                                <div className="ml-auto">
                                    <Loader2 className="animate-spin h-4 w-4 text-zinc-500" />
                                </div>
                            )}
                        </div>
                    ))}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}