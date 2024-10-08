"use client";

import { serverWithMembersWithProfiles } from "@/lib/types";
import { MemberRole } from "@prisma/client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BadgePlus, ChevronDown, LogOut, Settings, Trash2, UserPlus, Users } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

interface serverHeaderProps {
    server: serverWithMembersWithProfiles,
    role?: MemberRole
}

const ServerHeader = ({
    server,
    role
}: serverHeaderProps) => {
    const { onOpen } = useModal();

    const isAdmin = role === MemberRole.ADMIN;
    const isModerator = isAdmin || role === MemberRole.MODERATOR;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className="focus:outline-none"
                asChild
            >
                <button
                    className="w-full text-base font-semibold px-3 flex items-center justify-between h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:bg-zinc-700/50 transition"
                >
                    <div>
                        {server.name}
                    </div>
                    <div>
                        <ChevronDown className="h-6 w-6" />
                    </div>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]"
            >
                {isModerator && (
                    <DropdownMenuItem
                        onClick={() => onOpen("invite", { server })}
                        className="px-3 py-2 text-indigo-600 dark:text-indigo-400 focus:bg-indigo-500 focus:text-white dark:focus:text-white text-sm cursor-pointer"
                    >
                        Invite People <UserPlus className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {isAdmin && (
                    <DropdownMenuItem
                        onClick={() => onOpen("editServer", { server })}
                        className="px-3 py-2 focus:bg-indigo-500 focus:text-white dark:focus:text-white text-sm cursor-pointer"
                    >
                        Server Settings <Settings className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {isAdmin && (
                    <DropdownMenuItem
                        onClick={() => onOpen("members", { server })}
                        className="px-3 py-2 focus:bg-indigo-500 focus:text-white dark:focus:text-white text-sm cursor-pointer"
                    >
                        Manage Members <Users className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {isAdmin && (
                    <DropdownMenuItem
                        onClick={() => onOpen("createChannel", { server })}
                        className="px-3 py-2 focus:bg-indigo-500 focus:text-white dark:focus:text-white text-sm cursor-pointer"
                    >
                        Create Channel <BadgePlus className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {isModerator && (
                    <DropdownMenuSeparator className="w-full mx-auto" />
                )}
                {isAdmin && (
                    <DropdownMenuItem
                        onClick={() => onOpen("deleteServer", { server })}
                        className="px-3 py-2 text-red-500 focus:bg-red-500 focus:text-white dark:focus:text-white text-sm cursor-pointer"
                    >
                        Delete Server <Trash2 className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {!isAdmin && (
                    <DropdownMenuItem
                        onClick={() => onOpen("leaveServer", { server })}
                        className="px-3 py-2 text-red-500 focus:bg-red-500 focus:text-white dark:focus:text-white text-sm cursor-pointer"
                    >
                        Leave Server <LogOut className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>

    );
}

export default ServerHeader;