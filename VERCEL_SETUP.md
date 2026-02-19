# Vercel Deployment Setup Guide

## Required Environment Variables

You need to set these environment variables in your Vercel project:

### 1. NEXTAUTH_SECRET
A secure random string used to encrypt JWT tokens. 

**Generate a new secret:**
```bash
openssl rand -base64 32
```

**Or use this one (already generated for you):**
```
JNs7pE2bgrOR0qAJVYecPcpl23OjeuGhIN2d7CImnKk=
```

### 2. DATABASE_URL

⚠️ **IMPORTANT**: SQLite does NOT work on Vercel (serverless environment). You MUST use a cloud database.

**For local development (SQLite):**
```
file:./prisma/dev.db
```

**For Vercel production**, you MUST use one of these options:

#### Option A: Use Vercel Postgres (Recommended - Free tier available)
1. Go to your Vercel project dashboard
2. Navigate to **Storage** → **Create Database** → **Postgres**
3. Vercel will automatically create a `DATABASE_URL` environment variable
4. **Important**: Your Prisma schema has been updated to use PostgreSQL
5. After creating the database, run: `npx prisma migrate deploy` in Vercel or locally with the production DATABASE_URL

#### Option B: Use Turso (SQLite in the cloud - Free tier)
1. Sign up at https://turso.tech
2. Create a database and get your connection string
3. Set the `DATABASE_URL` in Vercel to your Turso connection string

#### Option C: Use another PostgreSQL provider
- Supabase (free tier): https://supabase.com
- Neon (free tier): https://neon.tech
- Railway (free tier with limits): https://railway.app

### 3. NEXTAUTH_URL (Optional but recommended)
Your production URL:
```
https://esol-resources-tau.vercel.app
```

## How to Set Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Click on **Settings** → **Environment Variables**
3. Add each variable:
   - **Key**: `NEXTAUTH_SECRET`
   - **Value**: `JNs7pE2bgrOR0qAJVYecPcpl23OjeuGhIN2d7CImnKk=`
   - **Environment**: Select all (Production, Preview, Development)
   - Click **Save**

4. Add `DATABASE_URL`:
   - **Key**: `DATABASE_URL`
   - **Value**: `file:./prisma/dev.db` (for SQLite) or your production database URL
   - **Environment**: Select all
   - Click **Save**

5. Add `NEXTAUTH_URL`:
   - **Key**: `NEXTAUTH_URL`
   - **Value**: `https://esol-resources-tau.vercel.app`
   - **Environment**: Production (or all if you want)
   - Click **Save**

6. After adding variables, **redeploy** your application for changes to take effect

## Local Development Setup

Your `.env.local` file has been created with:
- `DATABASE_URL` pointing to your local SQLite database
- `NEXTAUTH_SECRET` set to the generated secret
- `NEXTAUTH_URL` set to `http://localhost:3000`

## Prisma Setup

Prisma Client has been generated. Your database is already set up at `prisma/dev.db`.

To run migrations (if needed):
```bash
npx prisma migrate deploy
```

To seed the database:
```bash
npm run db:seed
```

## Step-by-Step Setup for Vercel Postgres

### 1. Create a Postgres Database in Vercel
1. Go to https://vercel.com/dashboard
2. Select your project (esol-resources-tau or similar)
3. Click on the **Storage** tab
4. Click **Create Database**
5. Select **Postgres**
6. Choose a name (e.g., "class-companion-db")
7. Select a region (choose one closest to your users)
8. Click **Create**

Vercel will automatically add the `DATABASE_URL` environment variable to your project.

### 2. Set Required Environment Variables
1. In your Vercel project, go to **Settings** → **Environment Variables**
2. Add `NEXTAUTH_SECRET`:
   - **Key**: `NEXTAUTH_SECRET`
   - **Value**: `JNs7pE2bgrOR0qAJVYecPcpl23OjeuGhIN2d7CImnKk=`
   - **Environment**: Select all (Production, Preview, Development)
3. Add `NEXTAUTH_URL`:
   - **Key**: `NEXTAUTH_URL`
   - **Value**: `https://esol-resources-tau.vercel.app` (or your actual URL)
   - **Environment**: Production

### 3. Deploy Your Changes
1. Commit and push your changes:
   ```bash
   git add .
   git commit -m "Switch to PostgreSQL for Vercel deployment"
   git push
   ```
2. Vercel will automatically redeploy
3. The build script will now run `prisma migrate deploy` to create your database tables

### 4. Seed Your Database (Optional)
After deployment succeeds, you can seed your production database:
1. Install Vercel CLI: `npm i -g vercel`
2. Link your project: `vercel link`
3. Pull environment variables: `vercel env pull .env.production`
4. Run seed: `DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2-) npm run db:seed`

## Troubleshooting

### 404 Error
If you see a 404 error after deployment:
1. ✅ Make sure `NEXTAUTH_SECRET` is set in Vercel
2. ✅ Make sure `DATABASE_URL` is set in Vercel (created by Postgres database)
3. ✅ Check the Vercel build logs for any errors
4. ✅ Make sure migrations ran successfully (check build logs for "prisma migrate deploy")
5. Redeploy after adding environment variables

### Build Failures
- Check that Postgres database was created successfully
- Verify environment variables are set for all environments
- Look for Prisma migration errors in build logs

### Database Connection Issues
- Ensure the `DATABASE_URL` from Vercel Postgres is being used
- Check that your Prisma schema is set to `provider = "postgresql"`

