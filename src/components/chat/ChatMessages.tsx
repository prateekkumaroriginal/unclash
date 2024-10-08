"use client";

import { Member } from "@prisma/client";
import ChatWelcome from "./ChatWelcome";
import { useChatQuery } from "@/hooks/use-chat-query";
import { Loader2, ServerCrash } from "lucide-react";
import { format } from "date-fns";
import { messageWithMemberWithProfile } from "@/lib/types";
import { Fragment, useRef } from "react";
import ChatItem from "./ChatItem";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { useChatScroll } from "@/hooks/use-chat-scroll";

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
    const queryKey = `${type}:${chatId}`;

    const chatRef = useRef(null);
    const bottomRef = useRef(null);

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

    useChatScroll({
        bottomRef,
        chatRef,
        loadMore: fetchNextPage,
        shouldLoadMore: !isFetchingNextPage && hasNextPage,
        count: data?.pages?.[0].items?.length ?? 0
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
        <div ref={chatRef} className="flex-1 flex flex-col py-4 overflow-y-auto">
            {!hasNextPage && <div className="flex-1" />}

            {!hasNextPage && <ChatWelcome
                type={type}
                name={name}
            />}

            {hasNextPage && (
                <div className="flex justify-center">
                    {isFetchingNextPage ? (
                        <Loader2 className="h-7 w-7 text-zinc-500 dark:text-zinc-400 animate-spin my-4" />
                    ) : (
                        <button
                            onClick={() => fetchNextPage()}
                            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition"
                        >
                            Load Previous Messages
                        </button>
                    )}
                </div>
            )}

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

            <div ref={bottomRef} />
        </div>
    );
}

export default ChatMessages;