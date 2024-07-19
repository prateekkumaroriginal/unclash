"use client"

import { useParams } from "next/navigation";

const ServerPage = () => {
    const { serverId } = useParams();

    return (
        <div>
            Server ID Page
        </div>
    );
}

export default ServerPage;