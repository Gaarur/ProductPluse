import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/demo(.*)",
  "/pricing",
  "/p/(.*)",           // public feedback board
  "/changelog/(.*)",   // public changelog
  "/roadmap/(.*)",     // public roadmap
  "/api/widget/(.*)",  // embeddable widget API
  "/api/changelog(.*)", // public changelog API for widget
  "/api/rss/(.*)",     // RSS feed
  "/api/stripe/webhook(.*)", // Stripe webhooks
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Redirect logged-in users away from sign-in/sign-up to dashboard
  if (userId && (
    req.nextUrl.pathname.startsWith("/sign-in") ||
    req.nextUrl.pathname.startsWith("/sign-up")
  )) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Protect private routes — redirect unauthenticated users to sign-in
  if (!isPublicRoute(req) && !userId) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
