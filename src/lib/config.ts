/**
 * EduAI - Typed Environment Configuration
 * 
 * Centralizes all environment variables into a single typed object.
 * Consumed across the app instead of raw process.env calls.
 */

export const config = {
  /** Current environment: 'development' | 'production' */
  env: process.env.NEXT_PUBLIC_APP_ENV || "development",

  /** Whether the app is running in development mode */
  isDev: process.env.NEXT_PUBLIC_APP_ENV === "development",

  /** Whether the app is running in production mode */
  isProd: process.env.NEXT_PUBLIC_APP_ENV === "production",

  /** Backend API base URL */
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",

  /** Application display name */
  appName: process.env.NEXT_PUBLIC_APP_NAME || "EduAI",

  /** Public site URL (used for SEO, OG tags, sitemap) */
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
} as const;

/**
 * Feature Flags
 * 
 * Toggle features based on environment.
 * In development, debugging tools and verbose agent reasoning are shown.
 */
export const featureFlags = {
  /** Show the AI agent reasoning panel in the Tutor workspace */
  showAgentReasoning: !config.isProd,

  /** Enable verbose console logging */
  verboseLogging: !config.isProd,

  /** Show the "Offline Cached" status badge */
  showOfflineStatus: true,

  /** Enable mock authentication (no real backend) */
  useMockAuth: true,
} as const;
