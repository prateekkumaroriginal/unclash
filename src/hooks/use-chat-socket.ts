import { useSocket } from "@/components/providers/socket-provider";
import { messageWithMemberWithProfile } from "@/lib/types";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

interface ChatSocketProps {
    addKey: string;
    updateKey: string;
    queryKey: string;
}

export const useChatSocket = ({
    addKey,
    updateKey,
    queryKey
}: ChatSocketProps) => {
    const { socket } = useSocket();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!socket) {
            return;
        }

        socket.on(updateKey, (message: messageWithMemberWithProfile) => {
            queryClient.setQueryData([queryKey], (oldData: InfiniteData<any, unknown>) => {
                console.log(typeof oldData);
                if (!oldData || !oldData.pages || oldData.pages.length === 0) {
                    return oldData;
                }
                console.log(typeof oldData.pages[0]);

                const newDataPages = oldData.pages.map((page: any) => ({
                    ...page,
                    items: page.items.map((item: messageWithMemberWithProfile) => {
                        if (item.id === message.id) {
                            return message;
                        }
                        return item;
                    })
                }));

                return {
                    ...oldData,
                    pages: newDataPages
                }
            });
        });

        socket.on(addKey, (message: messageWithMemberWithProfile) => {
            queryClient.setQueryData([queryKey], (oldData: InfiniteData<any, unknown>) => {
                if (!oldData || !oldData.pages || oldData.pages.length === 0) {
                    return {
                        pages: [{
                            items: [message]
                        }]
                    }
                }

                const newDataPages = [...oldData.pages];

                newDataPages[0] = {
                    ...newDataPages[0],
                    items: [
                        message,
                        ...newDataPages[0].items
                    ]
                }

                return {
                    ...oldData,
                    pages: newDataPages
                }
            });
        });

        return () => {
            socket.off(addKey);
            socket.off(updateKey);
        }
    }, [queryClient, addKey, updateKey, socket, queryKey]);
}