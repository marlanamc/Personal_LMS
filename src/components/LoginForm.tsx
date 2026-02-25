"use client";

import { signIn, type SignInResponse } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { clearServiceWorkerCache } from "@/lib/clearCache";

export default function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            // Add timeout to prevent hanging
            const timeoutPromise: Promise<SignInResponse | undefined> = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Login timeout')), 10000)
            );

            const signInPromise = signIn("credentials", {
                username,
                password,
                redirect: false,
            });

            const result = await Promise.race([signInPromise, timeoutPromise]);

            if (result?.error) {
                console.error('[Login] Error:', result.error);
                setError(`Invalid credentials. Please check your username and password.`);
            } else if (result?.ok) {
                // Clear PWA cache to ensure fresh content for this user (important for shared computers)
                await clearServiceWorkerCache();
                router.push("/dashboard");
                router.refresh();
            } else {
                setError("Login failed. Please try again.");
            }
        } catch (error: unknown) {
            console.error('[Login] Exception:', error);
            if (error instanceof Error && error.message === 'Login timeout') {
                setError("Login is taking too long. Please check your connection and try again.");
            } else {
                setError("An error occurred. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 w-full">
            <div className="border border-border rounded-2xl p-6 space-y-6 bg-bg-secondary/90 shadow-lg backdrop-blur-sm">
                <div>
                    <label htmlFor="username" className="block text-sm font-semibold mb-2 text-text">
                        Username
                    </label>
                    <input
                        id="username"
                        type="text"
                        name="username"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="username…"
                        className="w-full px-4 py-3 border-2 border-border rounded-xl transition-[border-color,box-shadow] duration-200 outline-none text-text bg-bg-tertiary/70 placeholder:text-text-light focus:border-primary focus:ring-2 focus:ring-primary/30"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-semibold mb-2 text-text">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 border-2 border-border rounded-xl transition-[border-color,box-shadow] duration-200 outline-none text-text bg-bg-tertiary/70 placeholder:text-text-light focus:border-primary focus:ring-2 focus:ring-primary/30"
                        required
                    />
                </div>
                {error && (
                    <div className="border rounded-lg p-3 bg-error/15 border-error/40">
                        <p className="text-sm font-medium text-error">
                            {error}
                        </p>
                    </div>
                )}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-xl font-semibold text-white transition-[background-color,transform,box-shadow] duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 bg-primary hover:bg-primary-dark shadow-md disabled:bg-text-light disabled:cursor-not-allowed disabled:hover:bg-text-light"
                >
                    {isLoading ? 'Signing in…' : 'Sign In'}
                </button>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-bg-secondary px-2 text-text-muted">Or continue with</span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => signIn("spotify", { callbackUrl: "/dashboard" })}
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-semibold bg-[#1DB954] hover:bg-[#1ed760] text-black transition-all duration-200 shadow-sm active:scale-95"
                >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                        <path d="M12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0ZM17.4111 17.3053C17.1895 17.6534 16.7369 17.7612 16.3888 17.5396C13.5907 15.8288 10.071 15.4403 5.92502 16.3883C5.53037 16.478 5.1388 16.223 5.04859 15.8284C4.95837 15.4338 5.21287 15.0422 5.60752 14.952C10.134 13.9167 14.0044 14.3644 17.1691 16.2974C17.5173 16.519 17.6327 16.9634 17.4111 17.3053ZM18.8953 14.0326C18.6146 14.4841 18.0267 14.6304 17.5681 14.3497C14.3645 12.3831 9.47164 11.808 5.68417 12.9649C5.16853 13.123 4.61914 12.8306 4.46109 12.315C4.30304 11.7993 4.59547 11.2499 5.11111 11.0919C9.44391 9.77383 14.8368 10.4146 18.5772 12.7122C19.0427 12.9929 19.1829 13.5811 18.8953 14.0326ZM19.0305 10.6433C15.1979 8.36979 8.8752 8.16104 5.22557 9.26768C4.63935 9.4457 4.01562 9.1098 3.8376 8.52358C3.65958 7.93736 3.99548 7.31363 4.5817 7.13562C8.78859 5.85764 15.7725 6.09506 20.2078 8.72465C20.7335 9.03541 20.9 9.71549 20.5891 10.2411C20.2783 10.7668 19.5583 10.9333 19.0305 10.6433Z"/>
                    </svg>
                    Sign in with Spotify
                </button>
            </div>
        </form>
    );
}
