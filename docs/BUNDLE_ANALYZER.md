# Bundle Analyzer Setup Guide

## Overview

`@next/bundle-analyzer` is configured to help you visualize and optimize your Next.js bundle sizes. It generates interactive HTML reports showing the size of each package in your bundle.

## Usage

### Analyze Full Bundle

Run this command to analyze both server and client bundles:

```bash
npm run analyze
```

This will:
1. Build your Next.js app
2. Generate bundle analysis reports
3. Open interactive HTML reports in your browser automatically

### Analyze Server Bundle Only

```bash
npm run analyze:server
```

### Analyze Browser Bundle Only

```bash
npm run analyze:browser
```

## What You'll See

After running the analyzer, you'll get:

1. **Interactive HTML Reports** - Opens automatically in your browser
2. **Two Reports**:
   - `client.html` - Client-side bundle (what users download)
   - `server.html` - Server-side bundle

3. **Visualization**:
   - Box sizes represent bundle size
   - Hover to see package details
   - Click to drill down into dependencies

## Interpreting Results

### Key Metrics to Watch

1. **Total Bundle Size**
   - Aim for < 200KB for initial JS load (gzipped)
   - Monitor for unexpected growth

2. **Large Dependencies**
   - Look for unexpectedly large packages
   - Check if you're importing entire libraries when you only need parts

3. **Duplicate Dependencies**
   - Multiple versions of the same package
   - Can be resolved with package resolution

### Common Issues to Look For

- **Large Icons**: If `lucide-react` is large, ensure you're importing specific icons
- **Animation Libraries**: `framer-motion` should be tree-shaken (covered by `optimizePackageImports`)
- **Chart Libraries**: `recharts` can be large - consider dynamic imports for charts

## Optimization Tips

### 1. Dynamic Imports for Heavy Components

If you see large components that aren't immediately needed:

```tsx
// Instead of:
import { HeavyChart } from 'recharts';

// Use:
const HeavyChart = dynamic(() => import('recharts').then(mod => mod.HeavyChart), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});
```

### 2. Check Icon Imports

Ensure you're importing specific icons:

```tsx
// ✅ Good
import { Trophy, Flame } from 'lucide-react';

// ❌ Bad (imports entire library)
import * as Icons from 'lucide-react';
```

### 3. Monitor Over Time

Run the analyzer:
- After adding new dependencies
- Before major releases
- When bundle size seems high

## Configuration

The analyzer is configured in `next.config.ts`:

```tsx
const bundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
```

It only runs when `ANALYZE=true` is set, so it won't slow down regular builds.

## CI/CD Integration (Optional)

You can add bundle size checks to CI:

```bash
# In your CI script
npm run build
npm run analyze

# Check bundle size and fail if too large
# (You'd need a custom script for this)
```

## Notes

- The analyzer runs a full production build, so it may take a few minutes
- Reports are saved in `.next/analyze/` directory
- The analyzer automatically opens reports in your default browser

## Troubleshooting

### Reports Don't Open Automatically

If the browser doesn't open automatically:
1. Check `.next/analyze/` directory for HTML files
2. Open `client.html` or `server.html` manually

### Build Fails

If the build fails during analysis:
1. Check that all dependencies are installed
2. Ensure your regular build works: `npm run build`
3. Check for TypeScript errors: `npm run typecheck`

## Related Documentation

- [Next.js Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)
- [Next.js Performance Optimization](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Vercel React Best Practices](./vercel-react-best-practices.md)
