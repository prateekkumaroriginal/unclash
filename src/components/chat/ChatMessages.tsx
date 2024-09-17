"use client";

import { Member } from "@prisma/client";
import ChatWelcome from "./ChatWelcome";
import { useChatQuery } from "@/hooks/use-chat-query";
import { Loader2, ServerCrash } from "lucide-react";
import { format } from "date-fns";
import { messageWithMemberWithProfile } from "@/lib/types";
import { Fragment } from "react";
import ChatItem from "./ChatItem";
import { useChatSocket } from "@/hooks/use-chat-socket";

const DATE_FORMAT = "HH:mm\t  d MMM yyyy";

interface ChatMessagesProps {
    name: string;
    member: Member;
    chatId: string;
    apiUrl: string;
    socketUrl: string;
    socketQuery: Record<string, string>;
    paramKey: "channelId" | "conversationId";
    paramValue: string;
    type: "channel" | "conversation";
}

const ChatMessages = ({
    name,
    member,
    chatId,
    apiUrl,
    socketUrl,
    socketQuery,
    paramKey,
    paramValue,
    type
}: ChatMessagesProps) => {
    const queryKey = `channel:${chatId}`

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status
    } = useChatQuery({
        queryKey,
        apiUrl,
        paramKey,
        paramValue
    });

    useChatSocket({
        addKey: `${queryKey}:messages`,
        updateKey: `${queryKey}:messages:update`,
        queryKey
    });

    if (status === "pending") {
        return <div className="flex flex-col flex-1 justify-center items-center">
            <Loader2 className="h-7 w-7 text-zinc-500 dark:text-zinc-400 animate-spin my-4" />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Loading Messages...
            </p>
        </div>
    }
    if (status === "error") {
        return <div className="flex flex-col flex-1 justify-center items-center">
            <ServerCrash className="h-7 w-7 text-zinc-500 dark:text-zinc-400 my-4" />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Something went wrong!
            </p>
        </div>
    }

    return (
        <div className="flex-1 flex flex-col py-4 overflow-y-auto">
            <div className="flex-1" />

            <ChatWelcome
                type={type}
                name={name}
            />

            <div className="flex flex-col-reverse mt-auto">
                {data?.pages.map((page, i) => (
                    <Fragment key={i}>
                        {page?.items.map((message: messageWithMemberWithProfile) => (
                            <ChatItem
                                key={message.id}
                                id={message.id}
                                currentMember={member}
                                member={message.member}
                                content={message.content}
                                fileUrl={message.fileUrl}
                                deleted={message.deleted}
                                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                                isUpdated={message.createdAt !== message.updatedAt}
                                socketUrl={socketUrl}
                                socketQuery={socketQuery}
                            />
                        ))}
                    </Fragment>
                ))}
            </div>
        </div>
    );
}

export default ChatMessages;