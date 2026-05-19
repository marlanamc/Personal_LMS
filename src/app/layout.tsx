import type { Metadata, Viewport } from "next";
import { Lato, DM_Sans, Caveat, Playfair_Display } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import { Analytics } from "@vercel/analytics/next";
import {
  DARK_DASHBOARD_THEME_COLOR,
  DARK_DEFAULT_THEME_COLOR,
  LIGHT_DASHBOARD_THEME_COLOR,
  LIGHT_DEFAULT_THEME_COLOR,
} from "@/lib/pwa-theme-colors";

const lato = Lato({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
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

/** Editorial serif for FocusHero dateline only (paired roman + italic) */
const playfairDisplay = Playfair_Display({
  variable: "--font-editorial-serif",
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
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
    { media: "(prefers-color-scheme: dark)", color: DARK_DASHBOARD_THEME_COLOR },
    { media: "(prefers-color-scheme: light)", color: LIGHT_DASHBOARD_THEME_COLOR },
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

  var isDashboardPath = window.location.pathname.indexOf('/dashboard') === 0;
  var themeColor = isDashboardPath
    ? (theme === 'light' ? '${LIGHT_DASHBOARD_THEME_COLOR}' : '${DARK_DASHBOARD_THEME_COLOR}')
    : (theme === 'light' ? '${LIGHT_DEFAULT_THEME_COLOR}' : '${DARK_DEFAULT_THEME_COLOR}');
  var metaSelector = 'meta[name="theme-color"][data-runtime-theme="true"]';
  var runtimeMeta = document.head.querySelector(metaSelector);

  if (!runtimeMeta) {
    runtimeMeta = document.createElement('meta');
    runtimeMeta.setAttribute('name', 'theme-color');
    runtimeMeta.setAttribute('data-runtime-theme', 'true');
    document.head.appendChild(runtimeMeta);
  }

  runtimeMeta.setAttribute('content', themeColor);
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
        className={`${lato.variable} ${dmSans.variable} ${caveat.variable} ${playfairDisplay.variable} bg-bg-primary text-text antialiased`}
      >
        <Providers>{children}</Providers>
        <ServiceWorkerRegistration />
        <PWAInstallPrompt />
        <Analytics />
      </body>
    </html>
  );
}
