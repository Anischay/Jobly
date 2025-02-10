import { authMiddleware } from "@clerk/nextjs";
 
export default authMiddleware({
  // Public routes that don't require authentication
  publicRoutes: [
    "/",
    "/api/jobs/match",
    "/api/jobs/search",
    "/jobs",
    "/jobs/(.*)",
    "/about",
    "/contact"
  ],
  
  // Routes that can be accessed by anyone, but will have authentication information if the user is signed in
  ignoredRoutes: [
    "/api/webhook/clerk",
    "/api/jobs/public/(.*)"
  ],
});
 
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
