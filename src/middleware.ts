import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

const isPublicRoute = createRouteMatcher(['/signin(.*)', '/signup(.*)', '/', '/api/uploadthing']);

export default clerkMiddleware((auth, req) => {
    if (!isPublicRoute(req)) auth().protect();
});