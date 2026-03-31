"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { SoundProvider } from "@/context/SoundContext";
import { FocusTimerProvider } from "@/context/FocusTimerContext";
import { ThemeProvider } from "@/context/ThemeContext";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <SessionProvider
        basePath="/api/auth"
        refetchInterval={5 * 60} // Refetch session every 5 minutes
        refetchOnWindowFocus={true} // Refetch when app comes into focus (important for PWA)
      >
        <SoundProvider>
          <FocusTimerProvider>
            {children}
          </FocusTimerProvider>
        </SoundProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
