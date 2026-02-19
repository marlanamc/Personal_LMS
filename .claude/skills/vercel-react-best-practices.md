# Vercel React Best Practices

Enforce Vercel's React and Next.js best practices for optimal performance, bundle size, and user experience.

## When to Use

Use this skill when:
- Writing or reviewing React/Next.js components
- Implementing data fetching patterns
- Optimizing bundle size or performance
- Refactoring server/client components
- Reviewing code for performance issues
- Setting up Next.js configuration

## Critical Performance Rules (Ordered by Impact)

### 1. Bundle Size Optimization (CRITICAL)

#### Rule: `bundle-defer-third-party`
**Problem**: Third-party scripts (analytics, trackers) block initial render and hydration.

**Solution**: Load third-party scripts after hydration or use dynamic imports.

**Bad**:
```tsx
// In layout.tsx or component
import { Analytics } from '@vercel/analytics/next';
// Analytics loads immediately, blocking render
```

**Good**:
```tsx
// Defer analytics until after hydration
'use client';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';

const Analytics = dynamic(() => import('@vercel/analytics/react'), {
  ssr: false,
});
```

#### Rule: `bundle-conditional`
**Problem**: Loading entire libraries when only small parts are needed.

**Solution**: Use conditional imports and dynamic imports for code splitting.

**Bad**:
```tsx
import { HeavyChart } from 'recharts';
// Loads entire recharts library even if chart isn't shown
```

**Good**:
```tsx
const HeavyChart = dynamic(() => import('recharts').then(mod => mod.HeavyChart), {
  ssr: false,
  loading: () => <div>Loading chart...</div>,
});
```

#### Rule: `bundle-preload`
**Problem**: Critical resources not preloaded, causing render delays.

**Solution**: Preload critical fonts, images, and data.

**Good**:
```tsx
// In layout.tsx
import { Fraunces } from 'next/font/google';

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap', // ✅ Good: prevents FOIT
  preload: true,   // ✅ Good: preloads font
});
```

### 2. Eliminate Async Waterfalls (CRITICAL)

#### Rule: `server-parallel-fetching`
**Problem**: Sequential async operations create waterfalls, delaying page load.

**Solution**: Run independent fetches in parallel using `Promise.all()` or `React.cache()`.

**Bad**:
```tsx
export default async function Page() {
  const user = await prisma.user.findUnique({ where: { id } });
  const classes = await prisma.class.findMany({ where: { userId: user.id } });
  const assignments = await prisma.assignment.findMany({ where: { classId: classes[0].id } });
  // ❌ Three sequential database calls = waterfall
}
```

**Good**:
```tsx
export default async function Page() {
  // ✅ Run independent fetches in parallel
  const [user, classes, assignments] = await Promise.all([
    prisma.user.findUnique({ where: { id } }),
    prisma.class.findMany({ where: { userId: id } }),
    prisma.assignment.findMany({ where: { classId: { in: classIds } } }),
  ]);
}
```

**Better** (with React.cache for deduplication):
```tsx
import { cache } from 'react';

const getUser = cache(async (id: string) => {
  return prisma.user.findUnique({ where: { id } });
});

export default async function Page() {
  const user = await getUser(id);
  // ✅ Subsequent calls to getUser(id) in same request are cached
}
```

### 3. Server-Side Data Fetching (HIGH)

#### Rule: `server-minimize-serialization`
**Problem**: Serializing large objects from server to client increases payload size.

**Solution**: Only send necessary data, use `select` in Prisma queries.

**Bad**:
```tsx
const user = await prisma.user.findUnique({ where: { id } });
// ❌ Sends entire user object including sensitive fields
```

**Good**:
```tsx
const user = await prisma.user.findUnique({
  where: { id },
  select: {
    id: true,
    name: true,
    email: true,
    // ✅ Only select needed fields
  },
});
```

#### Rule: `server-use-cache`
**Problem**: Repeated fetches of same data in same request.

**Solution**: Use `React.cache()` or Next.js `unstable_cache` for request-level caching.

**Good**:
```tsx
import { cache } from 'react';
import { unstable_cache } from 'next/cache';

// Request-level cache (same request)
const getCachedData = cache(async (id: string) => {
  return prisma.data.findUnique({ where: { id } });
});

// Time-based cache (across requests)
const getCachedData = unstable_cache(
  async (id: string) => prisma.data.findUnique({ where: { id } }),
  ['data-key'],
  { revalidate: 3600 }
);
```

### 4. Client-Side Data Fetching (HIGH)

#### Rule: `client-deduplicate-fetches`
**Problem**: Multiple components fetching same data independently.

**Solution**: Use SWR, React Query, or shared fetch cache.

**Bad**:
```tsx
// Component A
const [data, setData] = useState(null);
useEffect(() => {
  fetch('/api/data').then(r => r.json()).then(setData);
}, []);

// Component B (duplicates fetch)
const [data, setData] = useState(null);
useEffect(() => {
  fetch('/api/data').then(r => r.json()).then(setData);
}, []);
```

**Good**:
```tsx
// Use SWR for automatic deduplication
import useSWR from 'swr';

function ComponentA() {
  const { data } = useSWR('/api/data', fetcher);
}

function ComponentB() {
  const { data } = useSWR('/api/data', fetcher); // ✅ Reuses same request
}
```

### 5. Re-render Optimization (HIGH)

#### Rule: `render-memo-unnecessary`
**Problem**: Components re-render when props haven't changed.

**Solution**: Use `React.memo`, `useMemo`, `useCallback` appropriately.

**Bad**:
```tsx
function ExpensiveComponent({ items, onSelect }) {
  // ❌ Re-renders even if items/onSelect unchanged
  return items.map(item => <Item key={item.id} item={item} onClick={onSelect} />);
}
```

**Good**:
```tsx
const ExpensiveComponent = React.memo(({ items, onSelect }) => {
  return items.map(item => <Item key={item.id} item={item} onClick={onSelect} />);
});

// Or memoize callbacks
const handleSelect = useCallback((id: string) => {
  onSelect(id);
}, [onSelect]);
```

**Warning**: Don't over-memoize. Only use when:
- Component renders frequently
- Props are expensive to compare
- Component has significant render cost

#### Rule: `render-primitive-deps`
**Problem**: Using objects/arrays as dependencies causes unnecessary re-renders.

**Solution**: Use primitive values or stable references.

**Bad**:
```tsx
useEffect(() => {
  fetchData();
}, [{ id: userId, role: userRole }]); // ❌ New object every render
```

**Good**:
```tsx
useEffect(() => {
  fetchData();
}, [userId, userRole]); // ✅ Primitives are stable
```

### 6. Server vs Client Components (MEDIUM)

#### Rule: `component-server-by-default`
**Problem**: Unnecessary client components increase bundle size and reduce performance.

**Solution**: Use Server Components by default, only use `'use client'` when needed.

**When to use Server Components** (default):
- Data fetching
- Accessing backend resources (DB, APIs)
- Keeping sensitive data on server
- Large dependencies
- Static content

**When to use Client Components** (`'use client'`):
- Interactivity (onClick, onChange, etc.)
- Browser APIs (localStorage, window, etc.)
- State with hooks (useState, useEffect)
- Context providers
- Event listeners

**Bad**:
```tsx
'use client'; // ❌ Unnecessary - no interactivity
export default function StaticPage({ data }) {
  return <div>{data.title}</div>;
}
```

**Good**:
```tsx
// ✅ Server Component (default)
export default async function StaticPage() {
  const data = await fetchData();
  return <div>{data.title}</div>;
}
```

### 7. Rendering Performance (MEDIUM)

#### Rule: `render-defer-expensive`
**Problem**: Expensive computations block initial render.

**Solution**: Defer non-critical work, use `useDeferredValue`, `startTransition`.

**Bad**:
```tsx
function Component({ items }) {
  const sorted = items.sort((a, b) => a.name.localeCompare(b.name)); // ❌ Blocks render
  return <List items={sorted} />;
}
```

**Good**:
```tsx
import { useMemo, useDeferredValue } from 'react';

function Component({ items }) {
  const deferredItems = useDeferredValue(items);
  const sorted = useMemo(
    () => deferredItems.sort((a, b) => a.name.localeCompare(b.name)),
    [deferredItems]
  );
  return <List items={sorted} />;
}
```

### 8. Next.js Configuration (MEDIUM)

#### Rule: `config-optimize-package-imports`
**Problem**: Large libraries increase bundle size unnecessarily.

**Solution**: Use `optimizePackageImports` in `next.config.ts`.

**Good**:
```tsx
// next.config.ts
const nextConfig = {
  experimental: {
    optimizePackageImports: ['recharts', 'framer-motion', 'lucide-react'],
  },
};
```

#### Rule: `config-image-optimization`
**Problem**: Unoptimized images slow page loads.

**Solution**: Always use `next/image` for images.

**Bad**:
```tsx
<img src="/photo.jpg" alt="Photo" /> // ❌ No optimization
```

**Good**:
```tsx
import Image from 'next/image';
<Image src="/photo.jpg" alt="Photo" width={500} height={300} /> // ✅ Optimized
```

## Code Review Checklist

When reviewing React/Next.js code, check:

- [ ] **Bundle**: Are third-party scripts deferred? Are large libraries conditionally loaded?
- [ ] **Waterfalls**: Are independent async operations running in parallel?
- [ ] **Serialization**: Is only necessary data sent from server to client?
- [ ] **Caching**: Are repeated fetches cached (React.cache, unstable_cache)?
- [ ] **Deduplication**: Are client-side fetches deduplicated (SWR/React Query)?
- [ ] **Re-renders**: Are unnecessary re-renders prevented (memo, useMemo, useCallback)?
- [ ] **Components**: Are Server Components used by default? Client Components only when needed?
- [ ] **Dependencies**: Are useEffect dependencies primitive values?
- [ ] **Images**: Are images using `next/image`?
- [ ] **Fonts**: Are fonts using `next/font` with `display: 'swap'`?

## Project-Specific Checks

For this ESOL Teacher Resources project:

1. **Prisma Queries**: Always use `select` to minimize data transfer
2. **Analytics**: `@vercel/analytics` should be loaded after hydration (check `layout.tsx`)
3. **Client Components**: Verify `'use client'` is only used when necessary
4. **Parallel Fetches**: Check dashboard pages for sequential database calls
5. **Bundle Size**: Monitor `framer-motion`, `recharts`, `lucide-react` usage - use dynamic imports if possible

## Examples from This Codebase

### ✅ Good: Parallel Fetching
```tsx
// src/app/dashboard/profile/page.tsx
const [user, activityProgress, recentPointsLedger] = await Promise.all([
  prisma.user.findUnique({ where: { id: userId } }),
  prisma.activityProgress.findMany({ where: { userId } }),
  prisma.pointsLedger.findMany({ where: { userId } }),
]);
```

### ✅ Good: Server Component by Default
```tsx
// src/app/dashboard/page.tsx
export default async function DashboardPage() {
  // ✅ Server Component - fetches data on server
  const session = await getServerSession(authOptions);
  // ...
}
```

### ⚠️ Review: Analytics Loading
```tsx
// src/app/layout.tsx
<Analytics /> // Check if this should be deferred
```

## Performance Monitoring

- Use Vercel Analytics to track Core Web Vitals
- Monitor bundle size with `@next/bundle-analyzer`
- Check for async waterfalls in server logs
- Review client-side re-renders with React DevTools Profiler

## References

- [Vercel React Best Practices](https://vercel.com/blog/introducing-react-best-practices)
- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [React Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
