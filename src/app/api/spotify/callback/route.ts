import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
    exchangeSpotifyCodeForTokens,
    fetchSpotifyProfile,
    parseSpotifyOauthState,
    sanitizeReturnPath,
    SPOTIFY_OAUTH_STATE_COOKIE,
    SPOTIFY_OAUTH_STATE_MAX_AGE_SECONDS,
} from "@/lib/spotify";
import { logger } from "@/lib/logger";

function buildRedirectWithStatus(origin: string, returnTo: string, status: string): URL {
    const redirectUrl = new URL(sanitizeReturnPath(returnTo), origin);
    redirectUrl.searchParams.set("spotify", status);
    return redirectUrl;
}

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const state = requestUrl.searchParams.get("state");
    const providerError = requestUrl.searchParams.get("error");

    const cookieStore = await cookies();
    const stateCookie = cookieStore.get(SPOTIFY_OAUTH_STATE_COOKIE)?.value;

    const clearStateCookie = (response: NextResponse) => {
        response.cookies.set({
            name: SPOTIFY_OAUTH_STATE_COOKIE,
            value: "",
            path: "/",
            maxAge: 0,
        });
        return response;
    };

    if (providerError) {
        return clearStateCookie(
            NextResponse.redirect(buildRedirectWithStatus(requestUrl.origin, "/dashboard/timer", "denied"))
        );
    }

    if (!code || !state || !stateCookie || stateCookie !== state) {
        return clearStateCookie(
            NextResponse.redirect(buildRedirectWithStatus(requestUrl.origin, "/dashboard/timer", "state_mismatch"))
        );
    }

    const parsedState = parseSpotifyOauthState(state);
    if (!parsedState) {
        return clearStateCookie(
            NextResponse.redirect(buildRedirectWithStatus(requestUrl.origin, "/dashboard/timer", "invalid_state"))
        );
    }

    const stateAgeMs = Date.now() - parsedState.issuedAt;
    if (stateAgeMs > SPOTIFY_OAUTH_STATE_MAX_AGE_SECONDS * 1000) {
        return clearStateCookie(
            NextResponse.redirect(buildRedirectWithStatus(requestUrl.origin, "/dashboard/timer", "state_expired"))
        );
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.id !== parsedState.userId) {
        return clearStateCookie(
            NextResponse.redirect(buildRedirectWithStatus(requestUrl.origin, "/dashboard/timer", "not_authenticated"))
        );
    }

    try {
        const tokenResponse = await exchangeSpotifyCodeForTokens(code, requestUrl.origin);
        const spotifyProfile = await fetchSpotifyProfile(tokenResponse.access_token);

        const existingConnection = await prisma.spotifyConnection.findUnique({
            where: { userId: session.user.id },
            select: { refreshToken: true },
        });

        await prisma.spotifyConnection.upsert({
            where: { userId: session.user.id },
            update: {
                spotifyUserId: spotifyProfile.id,
                displayName: spotifyProfile.display_name,
                accessToken: tokenResponse.access_token,
                refreshToken: tokenResponse.refresh_token ?? existingConnection?.refreshToken ?? null,
                expiresAt: new Date(Date.now() + tokenResponse.expires_in * 1000),
            },
            create: {
                userId: session.user.id,
                spotifyUserId: spotifyProfile.id,
                displayName: spotifyProfile.display_name,
                accessToken: tokenResponse.access_token,
                refreshToken: tokenResponse.refresh_token ?? null,
                expiresAt: new Date(Date.now() + tokenResponse.expires_in * 1000),
            },
        });

        return clearStateCookie(
            NextResponse.redirect(
                buildRedirectWithStatus(requestUrl.origin, parsedState.returnTo, "connected")
            )
        );
    } catch (error) {
        logger.error("Spotify callback failed", error, {
            userId: session.user.id,
        });
        return clearStateCookie(
            NextResponse.redirect(buildRedirectWithStatus(requestUrl.origin, parsedState.returnTo, "connect_failed"))
        );
    }
}
