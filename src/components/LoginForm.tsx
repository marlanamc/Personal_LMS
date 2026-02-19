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
            </div>
        </form>
    );
}
