import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export const runtime = 'edge';

export default function Page() {
    return <SignIn appearance={{
        baseTheme: dark
    }} />;
}