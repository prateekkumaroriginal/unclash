import ServerSidebar from "@/components/server/ServerSidebar";
import { currentProfile } from "@/lib/current-profile";
import db from "@/lib/db";
import { redirect } from "next/navigation";

const ServerPageLayout = async ({
    children,
    params
}: {
    children: React.ReactNode,
    params: { serverId: string }
}) => {
    const profile = await currentProfile();
    if (!profile) {
        return redirect("/signin");
    }

    const server = await db.server.findUnique({
        where: {
            id: params.serverId,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });

    if (!server) {
        return redirect("/");
    }

    return (
        <div className="h-full">
            <ServerSidebar serverId={params.serverId} />

            <main className="h-full md:pl-60">
                {children}
            </main>
        </div>
    );
}

export default ServerPageLayout;