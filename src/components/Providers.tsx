"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <SessionProvider
            basePath="/api/auth"
            refetchInterval={5 * 60} // Refetch session every 5 minutes
            refetchOnWindowFocus={true} // Refetch when app comes into focus (important for PWA)
        >
            {children}
        </SessionProvider>
    );
}


