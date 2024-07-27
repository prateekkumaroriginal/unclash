import { currentProfile } from "@/lib/current-profile";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import NavigationAddServer from "./NavigationAddServer";
import NavigationItem from "./NavigationItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { UserButton } from "@clerk/nextjs";

const MainSidebar = async () => {
    const { profile, redirectToSignIn } = await currentProfile();
    if (!profile) {
        return redirectToSignIn();
    }

    const servers = await db.server.findMany({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });

    return (
        <nav className="sm:hidden md:flex flex-col fixed h-full w-[72px] z-30 inset-y-0 pt-3 mb-3 bg-[#e3e5e8] dark:bg-[#1e1f22]">
            <NavigationAddServer />
            <Separator
                className="h-[2px] rounded-md bg-zinc-300 dark:bg-zinc-700 w-10 mx-auto my-4"
            />

            <ScrollArea className="w-full">
                {servers?.map(server => (
                    <NavigationItem
                        name={server.name}
                        imageUrl={server.imageUrl}
                        id={server.id}
                        key={server.id}
                    />
                ))}

                {servers?.length > 0 &&
                    <Separator
                        className="h-[2px] rounded-md bg-zinc-300 dark:bg-zinc-700 w-10 mx-auto"
                    />
                }

                <div className="flex flex-col items-center">
                    <div className="my-4"><ModeToggle /></div>
                    <div>
                        <UserButton
                            appearance={{
                                elements: {
                                    avatarBox: "h-12 w-12"
                                }
                            }}
                        />
                    </div>
                </div>
            </ScrollArea>
        </nav>
    );
}

export default MainSidebar;