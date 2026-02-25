import crypto from "crypto";
import { logger } from "@/lib/logger";

const SPOTIFY_AUTHORIZE_URL = "https://accounts.spotify.com/authorize";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_PROFILE_URL = "https://api.spotify.com/v1/me";
const SPOTIFY_SCOPE = "user-read-email user-read-private";

const DEFAULT_RETURN_PATH = "/dashboard/timer";

export const SPOTIFY_OAUTH_STATE_COOKIE = "spotify_oauth_state";
export const SPOTIFY_OAUTH_STATE_MAX_AGE_SECONDS = 10 * 60;

export type SpotifyProfile = {
    id: string;
    display_name: string | null;
};

type SpotifyTokenResponse = {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token?: string;
    scope?: string;
};

type SpotifyStatePayload = {
    userId: string;
    returnTo: string;
    nonce: string;
    issuedAt: number;
};

function getRequiredSpotifyEnv(key: "SPOTIFY_CLIENT_ID" | "SPOTIFY_CLIENT_SECRET"): string {
    const value = process.env[key]?.trim();
    if (!value) {
        throw new Error(`${key} is required for Spotify connection`);
    }
    return value;
}

export function isSpotifyConfigured(): boolean {
    return Boolean(process.env.SPOTIFY_CLIENT_ID?.trim() && process.env.SPOTIFY_CLIENT_SECRET?.trim());
}

export function getSpotifyRedirectUri(origin: string): string {
    const configuredRedirect = process.env.SPOTIFY_REDIRECT_URI?.trim();
    if (configuredRedirect) {
        return configuredRedirect;
    }
    return `${origin}/api/spotify/callback`;
}

export function sanitizeReturnPath(returnTo: string | null | undefined): string {
    if (!returnTo) {
        return DEFAULT_RETURN_PATH;
    }

    if (!returnTo.startsWith("/") || returnTo.startsWith("//")) {
        return DEFAULT_RETURN_PATH;
    }

    return returnTo;
}

export function createSpotifyOauthState(userId: string, returnTo: string): string {
    const payload: SpotifyStatePayload = {
        userId,
        returnTo: sanitizeReturnPath(returnTo),
        nonce: crypto.randomUUID(),
        issuedAt: Date.now(),
    };

    return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

export function parseSpotifyOauthState(state: string): SpotifyStatePayload | null {
    try {
        const decodedState = Buffer.from(state, "base64url").toString("utf8");
        const payload = JSON.parse(decodedState) as Partial<SpotifyStatePayload>;

        if (typeof payload.userId !== "string" || payload.userId.length === 0) {
            return null;
        }

        if (typeof payload.returnTo !== "string") {
            return null;
        }

        if (typeof payload.nonce !== "string" || payload.nonce.length === 0) {
            return null;
        }

        if (typeof payload.issuedAt !== "number") {
            return null;
        }

        return {
            userId: payload.userId,
            returnTo: sanitizeReturnPath(payload.returnTo),
            nonce: payload.nonce,
            issuedAt: payload.issuedAt,
        };
    } catch (error) {
        logger.warn("Failed to parse Spotify OAuth state", { error });
        return null;
    }
}

export function buildSpotifyAuthorizeUrl(origin: string, state: string): string {
    const clientId = getRequiredSpotifyEnv("SPOTIFY_CLIENT_ID");

    const url = new URL(SPOTIFY_AUTHORIZE_URL);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("client_id", clientId);
    url.searchParams.set("scope", SPOTIFY_SCOPE);
    url.searchParams.set("redirect_uri", getSpotifyRedirectUri(origin));
    url.searchParams.set("state", state);
    url.searchParams.set("show_dialog", "true");

    return url.toString();
}

function createSpotifyClientAuthorizationHeader(): string {
    const clientId = getRequiredSpotifyEnv("SPOTIFY_CLIENT_ID");
    const clientSecret = getRequiredSpotifyEnv("SPOTIFY_CLIENT_SECRET");
    const credentials = Buffer.from(`${clientId}:${clientSecret}`, "utf8").toString("base64");
    return `Basic ${credentials}`;
}

async function requestSpotifyToken(formData: URLSearchParams): Promise<SpotifyTokenResponse> {
    const response = await fetch(SPOTIFY_TOKEN_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: createSpotifyClientAuthorizationHeader(),
        },
        body: formData.toString(),
    });

    if (!response.ok) {
        logger.warn("Spotify token request failed", { status: response.status });
        throw new Error("Spotify token request failed");
    }

    const payload = (await response.json()) as Partial<SpotifyTokenResponse>;

    if (
        typeof payload.access_token !== "string" ||
        typeof payload.token_type !== "string" ||
        typeof payload.expires_in !== "number"
    ) {
        throw new Error("Spotify token response was missing required fields");
    }

    return {
        access_token: payload.access_token,
        token_type: payload.token_type,
        expires_in: payload.expires_in,
        refresh_token: typeof payload.refresh_token === "string" ? payload.refresh_token : undefined,
        scope: typeof payload.scope === "string" ? payload.scope : undefined,
    };
}

export async function exchangeSpotifyCodeForTokens(
    code: string,
    origin: string
): Promise<SpotifyTokenResponse> {
    const formData = new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: getSpotifyRedirectUri(origin),
    });

    return requestSpotifyToken(formData);
}

export async function fetchSpotifyProfile(accessToken: string): Promise<SpotifyProfile> {
    const response = await fetch(SPOTIFY_PROFILE_URL, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        logger.warn("Failed to fetch Spotify profile", { status: response.status });
        throw new Error("Failed to fetch Spotify profile");
    }

    const payload = (await response.json()) as Partial<SpotifyProfile>;

    if (typeof payload.id !== "string") {
        throw new Error("Spotify profile response missing id");
    }

    return {
        id: payload.id,
        display_name: typeof payload.display_name === "string" ? payload.display_name : null,
    };
}
