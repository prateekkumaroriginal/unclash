import { Menu } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "./ui/button";
import MainSidebar from "./navigation/MainSidebar";
import ServerSidebar from "./server/ServerSidebar";

const MobileToggle = ({ serverId }: { serverId: string }) => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button size="icon" variant="ghost" className="md:hidden">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 flex gap-0 w-fit">
                <div>
                    <MainSidebar />
                </div>
                <div className="pl-[72px]">
                    <ServerSidebar serverId={serverId} />
                </div>
            </SheetContent>
        </Sheet>
    );
}

export default MobileToggle;