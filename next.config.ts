import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow network IP access during development
  allowedDevOrigins: ['10.162.102.121'],

  // Enable standalone output for Docker-optimized builds (~150MB image)
  output: "standalone",

  // Image optimization: allow external avatar/CDN domains
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google profile pictures
      },
    ],
  },

  // Security & performance headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(self), geolocation=()",
          },
        ],
      },
    ];
  },

  // Enable gzip compression
  compress: true,

  // Powered-by header removal (security best practice)
  poweredByHeader: false,
};

export default nextConfig;
