import type { Metadata, Viewport } from "next";
import { Lora, DM_Sans, Caveat } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import { Analytics } from "@vercel/analytics/next";

const lora = Lora({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-handwritten",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Marlie LMS",
  description:
    "A personal learning management system for tracking your own learning, planning classes, and mastering new skills.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Marlie LMS",
  },
  icons: {
    icon: [
      { url: "/icon-192-v2.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512-v2.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon-v2.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#122033" },
    { media: "(prefers-color-scheme: light)", color: "#F3F4F8" },
  ],
};

// Inline script to set theme before React hydrates (prevents flash)
const themeInitScript = `
(function() {
  var STORAGE_KEY = 'marlie-theme-preference';
  var stored = null;
  try { stored = localStorage.getItem(STORAGE_KEY); } catch(e) {}

  var preference = (stored === 'light' || stored === 'dark' || stored === 'auto') ? stored : 'auto';
  var theme;

  if (preference === 'light') {
    theme = 'light';
  } else if (preference === 'dark') {
    theme = 'dark';
  } else {
    // Auto mode: 6am-6pm = light, otherwise dark
    var hour = new Date().getHours();
    theme = (hour >= 6 && hour < 18) ? 'light' : 'dark';
  }

  var root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(theme);
  root.setAttribute('data-theme', theme);
  root.style.colorScheme = theme;
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${lora.variable} ${dmSans.variable} ${caveat.variable} bg-bg-primary text-text antialiased`}
      >
        <Providers>{children}</Providers>
        <ServiceWorkerRegistration />
        <PWAInstallPrompt />
        <Analytics />
      </body>
    </html>
  );
}
