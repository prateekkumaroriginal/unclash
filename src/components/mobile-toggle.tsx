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
        <div>
            <Sheet>
                <SheetTrigger asChild>
                    <Button size="icon" variant="ghost" className="md:hidden">
                        <Menu />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 flex gap-0">
                    <div>
                        <MainSidebar />
                    </div>
                    <ServerSidebar serverId={serverId} />
                </SheetContent>
            </Sheet>
        </div>
    );
}

export default MobileToggle;