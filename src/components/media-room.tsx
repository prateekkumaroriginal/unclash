"use client";

import { useEffect, useState } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

interface MediaRoomProps {
    roomId: string;
    video: boolean;
    audio: boolean;
}

const MediaRoom = ({
    roomId,
    video,
    audio
}: MediaRoomProps) => {
    const { user } = useUser();
    const [token, setToken] = useState("");

    useEffect(() => {
        if (!user?.username) {
            return;
        }

        (async () => {
            try {
                const resp = await fetch(`/api/get-participant-token?room=${roomId}&username=${user.username}`);
                const data = await resp.json();
                setToken(data.token);
            } catch (error) {
                console.log(error);
            }
        })();
    }, [user?.fullName, roomId]);

    if (token === null) {
        return <div className="flex flex-col flex-1 justify-center items-center">
            <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Loading ...
            </p>
        </div>
    }

    return (
        <LiveKitRoom
            video={video}
            audio={audio}
            token={token}
            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
            connect={true}
            data-lk-theme="default"
            style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}
        >
            <VideoConference />
        </LiveKitRoom>
    )
}

export default MediaRoom;