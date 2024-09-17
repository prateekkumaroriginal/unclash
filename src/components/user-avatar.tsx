import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface userAvatarProps {
    src?: string;
    className?: string;
}

const UserAvatar = ({
    src,
    className
}: userAvatarProps) => {
    return (
        <Avatar className={cn(
            "h-6 w-6 md:h-10 md:w-10",
            className
        )}>
            <AvatarImage src={src} />
        </Avatar>
    );
}

export default UserAvatar;