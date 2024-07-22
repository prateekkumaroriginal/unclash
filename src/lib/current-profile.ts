import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";

export const currentProfile = async () => {
    const { userId, redirectToSignIn } = auth();
    if (!userId) {
        return {
            profile: null,
            redirectToSignIn
        };
    }

    const profile = await db.profile.findUnique({
        where: {
            userId
        }
    });

    return {
        profile,
        redirectToSignIn
    };
}