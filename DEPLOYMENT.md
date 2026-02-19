# Production Deployment Guide

Complete guide for deploying Class Companion to production.

## Table of Contents

- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [Security Hardening](#security-hardening)
- [Deployment Options](#deployment-options)
- [Post-Deployment Verification](#post-deployment-verification)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

Before deploying to production, ensure you've completed these steps:

### Code Quality
- [ ] All TypeScript type errors resolved (`npm run typecheck`)
- [ ] ESLint warnings addressed (`npm run lint`)
- [ ] Production build succeeds (`npm run build`)
- [ ] Critical security issues fixed (run code review)
- [ ] Dependencies updated to latest stable versions

### Security
- [ ] All environment variables properly configured
- [ ] Database connection uses SSL/TLS
- [ ] NEXTAUTH_SECRET is cryptographically strong (32+ characters)
- [ ] CRON_SECRET configured for weekly reset endpoint
- [ ] No secrets committed to git
- [ ] HTTPS enforced in production

### Database
- [ ] All migrations applied and tested
- [ ] Database backups configured
- [ ] Performance indexes added
- [ ] Connection pooling configured
- [ ] Database user has minimal required permissions

### Testing
- [ ] Manual testing of critical flows completed
- [ ] Authentication and authorization tested
- [ ] Points/gamification system verified
- [ ] Teacher and student dashboards tested
- [ ] Mobile responsiveness checked

---

## Environment Setup

### Required Environment Variables

Create a `.env.production` file with these variables:

```bash
# Database (PostgreSQL)
POSTGRES_URL="postgresql://user:password@host:5432/database?sslmode=require"

# NextAuth
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="generate-a-32-character-random-string-here"
# Alternative: AUTH_SECRET (fallback for NEXTAUTH_SECRET)

# Cron Jobs
CRON_SECRET="generate-another-32-character-random-string"

# Node Environment
NODE_ENV="production"
```

### Generate Secure Secrets

Use these commands to generate cryptographically secure secrets:

```bash
# Generate NEXTAUTH_SECRET (Node.js)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Generate NEXTAUTH_SECRET (OpenSSL)
openssl rand -base64 32

# Generate CRON_SECRET
openssl rand -base64 32
```

### Environment Variable Security

**CRITICAL**: Never commit secrets to version control!

1. Add `.env.production` to `.gitignore`
2. Use environment variable management:
   - **Vercel**: Dashboard → Settings → Environment Variables
   - **Docker**: Use `--env-file` or secrets management
   - **Kubernetes**: Use ConfigMaps and Secrets

---

## Database Setup

### PostgreSQL Requirements

- PostgreSQL 14+ recommended
- SSL/TLS connection required for production
- Connection pooling enabled (Prisma handles this)

### Database Hosting Options

**Recommended Providers:**
1. **Neon** (https://neon.tech) - Serverless PostgreSQL, generous free tier
2. **Supabase** (https://supabase.com) - PostgreSQL with additional features
3. **Railway** (https://railway.app) - Easy PostgreSQL hosting
4. **AWS RDS** - Enterprise-grade managed PostgreSQL

### Migration Process

```bash
# 1. Apply all migrations to production database
npx prisma migrate deploy

# 2. Verify migration status
npx prisma migrate status

# 3. Generate Prisma Client (included in build)
npx prisma generate

# 4. Seed initial data (achievements, etc.)
npx tsx prisma/seed-achievements.ts
```

### Database Backup Strategy

**Daily Backups Recommended:**

For Neon/Supabase:
- Enable automatic backups in dashboard
- Point-in-time recovery recommended

For Self-Hosted:
```bash
# Manual backup
pg_dump $POSTGRES_URL > backup-$(date +%Y%m%d).sql

# Automated daily backup (crontab)
0 2 * * * pg_dump $POSTGRES_URL > /backups/db-$(date +\%Y\%m\%d).sql
```

---

## Security Hardening

### 1. Security Headers

Security headers are automatically applied via middleware (`src/middleware.ts`):
- Content-Security-Policy (CSP)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Strict-Transport-Security (HSTS)
- Referrer-Policy
- Permissions-Policy

### 2. Database Security

```sql
-- Create read-only user for analytics (optional)
CREATE USER analytics_readonly WITH PASSWORD 'strong_password';
GRANT CONNECT ON DATABASE your_database TO analytics_readonly;
GRANT USAGE ON SCHEMA public TO analytics_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO analytics_readonly;

-- Revoke unnecessary permissions from app user
REVOKE CREATE ON SCHEMA public FROM app_user;
```

### 3. Rate Limiting

**TODO**: Implement rate limiting for API routes.

Recommended approach:
```typescript
// Example: Use upstash/ratelimit or similar
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
});
```

### 4. CORS Configuration

If adding external API access, configure CORS carefully:

```typescript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "https://yourdomain.com" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE" },
        ],
      },
    ];
  },
};
```

---

## Deployment Options

### Option 1: Vercel (Recommended for Next.js)

**Pros**: Zero-config, automatic SSL, edge network, generous free tier
**Cons**: Vendor lock-in, serverless limitations

#### Steps:

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Configure Environment Variables**
   - Go to: Project Settings → Environment Variables
   - Add all variables from `.env.production`
   - Mark sensitive variables as "Secret"

4. **Configure Cron Jobs**
   - Create `vercel.json`:
   ```json
   {
     "crons": [{
       "path": "/api/cron/reset-weekly-points",
       "schedule": "0 0 * * 0"
     }]
   }
   ```

5. **Custom Domain**
   - Settings → Domains → Add Domain
   - Configure DNS (A/CNAME records)

### Option 2: Docker + VPS

**Pros**: Full control, predictable costs, no vendor lock-in
**Cons**: Manual setup, maintenance overhead

#### Dockerfile

Create `Dockerfile` in project root:

```dockerfile
FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Build application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env.production
    depends_on:
      - postgres
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: classcompanion
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: classcompanion
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  # Optional: Nginx reverse proxy
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
```

#### Deploy

```bash
# Build and start
docker-compose up -d

# Apply migrations
docker-compose exec app npx prisma migrate deploy

# View logs
docker-compose logs -f app

# Stop
docker-compose down
```

### Option 3: Railway

1. Connect GitHub repository
2. Configure environment variables
3. Railway auto-detects Next.js and deploys
4. Add PostgreSQL database from Railway dashboard

### Option 4: AWS/GCP/Azure

For enterprise deployments, consider:
- **AWS**: Elastic Beanstalk or ECS + RDS
- **GCP**: Cloud Run + Cloud SQL
- **Azure**: App Service + Azure Database for PostgreSQL

---

## Post-Deployment Verification

### 1. Health Check

Visit these URLs to verify deployment:

```bash
# Homepage loads
curl https://yourdomain.com

# API health check (create one if needed)
curl https://yourdomain.com/api/health

# Authentication works
# Try logging in via browser
```

### 2. Database Connectivity

```bash
# Verify migrations applied
npx prisma migrate status --schema=./prisma/schema.prisma

# Test database query
npx prisma studio
```

### 3. Environment Variables

Check logs for environment validation:
```bash
# Should see: "✅ Environment variables validated successfully"
# If errors, check logs for missing/invalid variables
```

### 4. Security Headers

Test security headers:
```bash
curl -I https://yourdomain.com | grep -i "x-frame-options\|content-security\|strict-transport"
```

Expected:
```
x-frame-options: DENY
content-security-policy: default-src 'self'; ...
strict-transport-security: max-age=31536000; includeSubDomains; preload
```

### 5. Functionality Test

Manual testing checklist:
- [ ] Student can log in
- [ ] Teacher can log in
- [ ] Student can join class with code
- [ ] Student can complete activity and earn points
- [ ] Leaderboard displays correctly
- [ ] Teacher can create assignment
- [ ] Teacher can view submissions
- [ ] Password reset works
- [ ] Weekly reset cron job configured

---

## Monitoring & Maintenance

### 1. Error Tracking

**Recommended**: Integrate Sentry for error tracking

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### 2. Application Logs

Access logs based on hosting:

**Vercel**:
```bash
vercel logs
```

**Docker**:
```bash
docker-compose logs -f app
```

**PM2** (VPS):
```bash
pm2 logs
```

### 3. Database Monitoring

Monitor these metrics:
- Connection pool utilization
- Query performance (slow queries)
- Database size growth
- Index usage

**PostgreSQL slow query log**:
```sql
-- Enable slow query logging
ALTER SYSTEM SET log_min_duration_statement = 1000; -- Log queries >1s
SELECT pg_reload_conf();

-- View slow queries
SELECT * FROM pg_stat_statements ORDER BY total_exec_time DESC LIMIT 10;
```

### 4. Uptime Monitoring

Use external uptime monitoring:
- **UptimeRobot** (free)
- **Pingdom**
- **Better Uptime**

Monitor:
- Homepage availability
- API endpoint health
- Database connectivity

### 5. Weekly Maintenance Tasks

```bash
# Weekly points reset (automated via cron)
curl -X POST https://yourdomain.com/api/cron/reset-weekly-points \
  -H "Authorization: Bearer $CRON_SECRET"

# Database backup verification
# Check that backups are running and restorable

# Review error logs
# Check Sentry or application logs for errors

# Security updates
npm audit
npm update
```

---

## Troubleshooting

### Issue: "NEXTAUTH_SECRET must be set"

**Solution**: Ensure `NEXTAUTH_SECRET` or `AUTH_SECRET` is configured in environment variables.

```bash
# Verify variable is set
echo $NEXTAUTH_SECRET

# If missing, add to .env.production or hosting dashboard
```

### Issue: "Database connection failed"

**Causes**:
1. Incorrect `POSTGRES_URL`
2. Database not accessible from hosting
3. SSL/TLS misconfiguration

**Solution**:
```bash
# Test connection string
psql $POSTGRES_URL

# For Neon/Supabase, ensure SSL mode
POSTGRES_URL="...?sslmode=require"

# Check database firewall rules
```

### Issue: "Prisma Client not generated"

**Solution**:
```bash
# Regenerate Prisma Client
npx prisma generate

# Rebuild application
npm run build
```

### Issue: "Migration failed"

**Causes**:
1. Schema drift (manual changes to DB)
2. Conflicting migrations

**Solution**:
```bash
# Check migration status
npx prisma migrate status

# Reset database (DESTRUCTIVE - dev only)
npx prisma migrate reset

# Production: Create baseline migration
npx prisma migrate resolve --applied "migration_name"
```

### Issue: "500 Internal Server Error"

**Debug steps**:
1. Check application logs
2. Review error tracking (Sentry)
3. Verify environment variables
4. Test database connectivity
5. Check for unhandled promise rejections

```bash
# Enable detailed error logging
NODE_ENV=development npm run build
```

### Issue: "Weekly reset not running"

**Vercel**:
- Check `vercel.json` cron configuration
- Verify in Vercel Dashboard → Cron Jobs

**Docker/VPS**:
```bash
# Set up crontab
crontab -e

# Add weekly reset (Sunday midnight UTC)
0 0 * * 0 curl -X POST https://yourdomain.com/api/cron/reset-weekly-points -H "Authorization: Bearer $CRON_SECRET"
```

### Issue: "High memory usage"

**Solution**:
1. Enable Next.js memory optimization
   ```json
   // next.config.ts
   {
     "experimental": {
       "optimizePackageImports": ["@mui/material", "lodash"]
     }
   }
   ```

2. Increase Node.js memory limit
   ```bash
   NODE_OPTIONS="--max-old-space-size=4096" npm start
   ```

3. Enable Prisma connection pooling
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("POSTGRES_URL")
     shadowDatabaseUrl = env("SHADOW_DATABASE_URL") // For migrations
   }
   ```

---

## Security Incident Response

If a security breach occurs:

1. **Immediately**:
   - Rotate all secrets (`NEXTAUTH_SECRET`, `CRON_SECRET`, database passwords)
   - Review audit logs for unauthorized access
   - Invalidate all user sessions

2. **Investigate**:
   - Check application logs for suspicious activity
   - Review database for unauthorized modifications
   - Analyze access patterns

3. **Remediate**:
   - Apply security patches
   - Reset compromised user passwords
   - Notify affected users if required by law

4. **Prevent**:
   - Conduct security audit
   - Implement additional monitoring
   - Update incident response plan

---

## Support & Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **NextAuth Docs**: https://next-auth.js.org/
- **Vercel Deployment**: https://vercel.com/docs
- **PostgreSQL Performance**: https://wiki.postgresql.org/wiki/Performance_Optimization

---

## License

Refer to project LICENSE file.
