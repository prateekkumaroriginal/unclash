"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { Socket, io as ClientIO } from 'socket.io-client'

type SocketContextType = {
    socket: null | Socket;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false
});

export const useSocket = () => {
    return useContext(SocketContext);
}

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const socketInstance = ClientIO(process.env.NEXT_PUBLIC_SOCKET_URL!, {
            path: "/api/socket/io"
        });

        socketInstance.on('connect', () => {
            setIsConnected(true);
        });

        socketInstance.on('disconnect', () => {
            setIsConnected(false);
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
            setSocket(null);
        }
    }, []);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    )
}