import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
    buildSpotifyAuthorizeUrl,
    createSpotifyOauthState,
    isSpotifyConfigured,
    sanitizeReturnPath,
    SPOTIFY_OAUTH_STATE_COOKIE,
    SPOTIFY_OAUTH_STATE_MAX_AGE_SECONDS,
} from "@/lib/spotify";
import { logger } from "@/lib/logger";

function buildTimerRedirect(requestUrl: URL, status: "not_configured" | "not_authenticated" | "oauth_error") {
    const redirectUrl = new URL("/dashboard/timer", requestUrl.origin);
    redirectUrl.searchParams.set("spotify", status);
    return NextResponse.redirect(redirectUrl);
}

export async function GET(request: Request) {
    if (!isSpotifyConfigured()) {
        return buildTimerRedirect(new URL(request.url), "not_configured");
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return buildTimerRedirect(new URL(request.url), "not_authenticated");
    }

    const requestUrl = new URL(request.url);
    const returnTo = sanitizeReturnPath(requestUrl.searchParams.get("returnTo"));

    try {
        const state = createSpotifyOauthState(session.user.id, returnTo);
        const authorizeUrl = buildSpotifyAuthorizeUrl(requestUrl.origin, state);

        const response = NextResponse.redirect(authorizeUrl);
        response.cookies.set({
            name: SPOTIFY_OAUTH_STATE_COOKIE,
            value: state,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: SPOTIFY_OAUTH_STATE_MAX_AGE_SECONDS,
        });

        return response;
    } catch (error) {
        logger.error("Failed to initialize Spotify OAuth", error, {
            userId: session.user.id,
        });
        return buildTimerRedirect(requestUrl, "oauth_error");
    }
}
