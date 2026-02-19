/**
 * Environment variable validation
 * Validates all required environment variables at startup
 * Fails fast with clear error messages if misconfigured
 */

type EnvVar = {
  key: string;
  required: boolean;
  description: string;
  validate?: (value: string) => boolean;
};

const envVars: EnvVar[] = [
  {
    key: 'POSTGRES_URL',
    required: true,
    description: 'PostgreSQL database connection string',
    validate: (value) => value.startsWith('postgresql://') || value.startsWith('postgres://'),
  },
  {
    key: 'NEXTAUTH_SECRET',
    required: true,
    description: 'NextAuth secret for JWT signing (min 32 characters)',
    validate: (value) => value.length >= 32,
  },
  {
    key: 'AUTH_SECRET',
    required: false, // Fallback for NEXTAUTH_SECRET
    description: 'Alternative auth secret (fallback for NEXTAUTH_SECRET)',
  },
  {
    key: 'NEXTAUTH_URL',
    required: process.env.NODE_ENV === 'production',
    description: 'NextAuth URL for production',
    validate: (value) => value.startsWith('http://') || value.startsWith('https://'),
  },
  {
    key: 'CRON_SECRET',
    required: process.env.NODE_ENV === 'production',
    description: 'Secret for cron endpoints (required in production)',
    validate: (value) => value.length >= 32,
  },
];

/**
 * Validate all environment variables
 * @throws Error if required variables are missing or invalid
 */
export function validateEnv(): void {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const envVar of envVars) {
    const value = process.env[envVar.key];

    // Check if required variable is missing
    if (envVar.required && !value) {
      errors.push(
        `❌ Missing required environment variable: ${envVar.key}\n   ${envVar.description}`
      );
      continue;
    }

    // Skip validation if optional and not provided
    if (!value) {
      if (process.env.NODE_ENV !== 'production') {
        warnings.push(`⚠️  Optional variable not set: ${envVar.key}`);
      }
      continue;
    }

    // Validate value if validator provided
    if (envVar.validate && !envVar.validate(value)) {
      errors.push(
        `❌ Invalid value for ${envVar.key}\n   ${envVar.description}\n   Current value: ${value.substring(0, 20)}...`
      );
    }
  }

  // Special validation: Ensure at least one auth secret is set
  if (!process.env.NEXTAUTH_SECRET && !process.env.AUTH_SECRET) {
    errors.push(
      `❌ Missing authentication secret\n   Set either NEXTAUTH_SECRET or AUTH_SECRET (min 32 characters)`
    );
  }

  // Print warnings in development
  if (warnings.length > 0 && process.env.NODE_ENV !== 'production') {
    console.warn('\n⚠️  Environment Warnings:');
    warnings.forEach((warning) => console.warn(`   ${warning}`));
    console.warn('');
  }

  // Fail fast if errors found
  if (errors.length > 0) {
    console.error('\n🚨 Environment Configuration Errors:\n');
    errors.forEach((error) => console.error(error));
    console.error('\n💡 Check your .env file and compare with .env.example\n');
    throw new Error('Environment validation failed');
  }

  // Success message in development
  if (process.env.NODE_ENV !== 'production') {
    console.log('✅ Environment variables validated successfully\n');
  }
}

/**
 * Get a required environment variable
 * @throws Error if variable is not set
 */
export function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  return value;
}

/**
 * Get an optional environment variable with default
 */
export function getOptionalEnv(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Check if running in development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}
