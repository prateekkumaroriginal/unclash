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
    const { profile, redirectToSignIn } = await currentProfile();
    if (!profile) {
        return redirectToSignIn();
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
            <div className="invisible md:visible md:flex">
                <ServerSidebar serverId={params.serverId} />
            </div>

            <main className="h-full md:pl-60">
                {children}
            </main>
        </div>
    );
}

export default ServerPageLayout;