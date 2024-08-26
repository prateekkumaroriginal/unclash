"use client";

import {
    useContext,
    createContext,
    useState,
    useEffect
} from 'react';
import { io as ClientIO, Socket } from 'socket.io-client';

type SocketContextType = {
    socket: Socket | undefined;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
    socket: undefined,
    isConnected: false
});

export const useSocket = () => {
    return useContext(SocketContext);
}

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState();
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const socketInstance = (ClientIO as any)(process.env.NEXT_PUBLIC_SOCKET_URL);

        socketInstance.on('connect', () => {
            setIsConnected(true);
        });

        socketInstance.on('disconnect', () => {
            setIsConnected(false);
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
            setSocket(undefined)
        }
    }, []);

    return (
        <SocketContext.Provider value={{ isConnected, socket }}>
            {children}
        </SocketContext.Provider>
    )
}