"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { SoundProvider } from "@/context/SoundContext";
import { CelebrationProvider } from "@/context/CelebrationContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { MilestoneCelebration } from "@/components/ui/MilestoneCelebration";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <SessionProvider
        basePath="/api/auth"
        refetchInterval={5 * 60} // Refetch session every 5 minutes
        refetchOnWindowFocus={true} // Refetch when app comes into focus (important for PWA)
      >
        <SoundProvider>
          <CelebrationProvider>
            {children}
            <MilestoneCelebration />
          </CelebrationProvider>
        </SoundProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}

