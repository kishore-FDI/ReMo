import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const protectedRoute = createRouteMatcher([
  "/virtualmeeting",
  "/virtualmeeting/upcoming",
  "/virtualmeeting/meeting(.*)",
  "/virtualmeeting/previous",
  "/virtualmeeting/recordings",
  "/virtualmeeting/personal-room",
]);

export default clerkMiddleware((auth, req) => {
  if (protectedRoute(req)) auth().protect();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
