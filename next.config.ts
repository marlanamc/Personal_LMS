import type { NextConfig } from "next";

// Conditionally enable bundle analyzer
// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  experimental: {
    // Optimize package imports to reduce bundle size
    // Tree-shake unused exports from these commonly used libraries
    optimizePackageImports: [
      'recharts',      // Chart library - large, only import what's needed
      'framer-motion', // Animation library - tree-shake unused components
      'lucide-react',  // Icon library - only bundle icons that are used
    ],
  },
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
