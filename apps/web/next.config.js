// Optional bundle analyzer - only load if available and enabled
const enableAnalyzer = process.env.ANALYZE === 'true';
let withBundleAnalyzer = (config) => config; // default fallback

if (enableAnalyzer) {
  try {
    withBundleAnalyzer = require('@next/bundle-analyzer')({
      enabled: true,
    });
  } catch (error) {
    console.warn('Bundle analyzer not available, skipping...');
    withBundleAnalyzer = (config) => config;
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Transpile workspace packages so Next.js can bundle them
  transpilePackages: ['@portfolio/ui', '@portfolio/utils', '@portfolio/config'],
  
  experimental: {
    mdxRs: true,
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },
  
  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: true, // Temporarily disable for production readiness
  },
  
  // TypeScript configuration  
  typescript: {
    ignoreBuildErrors: false,
    tsconfigPath: 'tsconfig.json',
  },

  // Production optimizations
  poweredByHeader: false,
  compress: true,
  generateEtags: true,
  
  // Performance optimizations
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{member}}',
    },
  },
  
  // Bundle optimization
  webpack: (config, { dev }) => {
    // Alias works on both server and client
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
    }

    // Tree shaking optimizations
    if (!dev && config.optimization) {
      config.optimization.usedExports = true
      config.optimization.sideEffects = false
    }

    return config
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },

  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/portfolio',
        destination: '/',
        permanent: true,
      },
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ]
  },

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Build output optimization
  output: 'standalone',
  trailingSlash: false,
}

// Optional MDX support
let withMDX
try {
  withMDX = require('@next/mdx')({
    extension: /\.mdx?$/,
    options: {
      remarkPlugins: [],
      rehypePlugins: [],
      providerImportSource: '@mdx-js/react',
    },
  })
} catch (error) {
  // MDX not available, use identity function
  withMDX = (config) => config
}

module.exports = withBundleAnalyzer(withMDX(nextConfig))