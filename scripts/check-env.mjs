const required = [];

const isVercel = Boolean(process.env.VERCEL);
const isProd = process.env.NODE_ENV === "production";

if (isVercel || isProd) {
  required.push("POSTGRES_URL");
  required.push("NEXTAUTH_SECRET|AUTH_SECRET");
  required.push("NEXTAUTH_URL|VERCEL_URL");
}

if (required.length === 0) process.exit(0);

const missing = [];

for (const entry of required) {
  const keys = entry.split("|").map((k) => k.trim()).filter(Boolean);
  const ok = keys.some((k) => Boolean(process.env[k]));
  if (!ok) missing.push(entry);
}

if (missing.length > 0) {
  const header = "[env-check] Missing required environment variables:";
  const lines = missing.map((m) => `- ${m}`);

  // eslint-disable-next-line no-console
  console.error([header, ...lines, "", "Fix this in Vercel → Project Settings → Environment Variables."].join("\n"));
  process.exit(1);
}

