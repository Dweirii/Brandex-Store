/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations for video-heavy e-commerce
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react', '@radix-ui/react-*'],
    optimizeCss: true,
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // Ensure strict bundling of external packages for production
  serverExternalPackages: ['sharp'],

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Additional performance optimizations
  compress: true,
  poweredByHeader: false,

  async redirects() {
    return [
      {
        source: "/some-old-path",
        destination: "/new-path",
        permanent: true,
      },
      {
        source: "/manifest.webmanifest",
        destination: "/manifest",
        permanent: false,
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "brandex.b-cdn.net",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "brandex-cdn.b-cdn.net",
      },
      {
        protocol: "https",
        hostname: "image-brandex.b-cdn.net",
      },
      {
        protocol: "https",
        hostname: "cdn.brandex.local",
      }
    ],
    // Image optimization settings
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Security and performance headers (CSP addresses PCI-DSS/OWASP/ISO 27001)
  async headers() {
    const csp = [
      "default-src 'self'",
      "frame-ancestors 'none'",
      "frame-src 'self' https://*.clerk.accounts.dev https://*.clerk.com https://*.clerk.dev https://clerk.brandexme.com",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.accounts.dev https://*.clerk.com https://*.clerk.dev https://clerk.brandexme.com https://www.googletagmanager.com https://www.google-analytics.com https://googleads.g.doubleclick.net https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https:",
      "font-src 'self' https://fonts.gstatic.com data:",
      "connect-src 'self' https://*.clerk.accounts.dev https://*.clerk.com https://*.clerk.dev https://clerk.brandexme.com https://www.google.com https://www.google-analytics.com https://www.merchant-center-analytics.goog https://googleads.g.doubleclick.net https://vitals.vercel-insights.com https://va.vercel-scripts.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ');

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: csp,
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
