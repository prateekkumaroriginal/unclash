import { ChannelType, Server } from "@prisma/client";
import { create } from "zustand";

export type modalType = "createServer" | "invite" | "editServer" | "members" | "createChannel" | "leaveServer" | "deleteServer" | "deleteChannel" | "editChannel" | "messageFile" | "deleteMessage";

interface channelData {
    id: string;
    name: string;
}

interface modalData {
    server?: Server;
    channelData?: channelData;
    channelType?: ChannelType;
    apiUrl?: string;
    query?: Record<string, any>;
}

interface modalStore {
    type: modalType | null,
    data: modalData,
    isOpen: boolean,
    onOpen: (type: modalType, data?: modalData) => void,
    onClose: () => void
}

export const useModal = create<modalStore>((set) => ({
    type: null,
    isOpen: false,
    data: {},
    onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
    onClose: () => set({ type: null, isOpen: false })
}));