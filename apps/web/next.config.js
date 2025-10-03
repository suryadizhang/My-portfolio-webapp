/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { mdxRs: true },
  pageExtensions: ['ts','tsx','js','jsx','md','mdx'],
  
  // 👇 Important for monorepos: transpile your workspace pkgs
  transpilePackages: ['@portfolio/ui', '@portfolio/utils', '@portfolio/config'],
  
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false, tsconfigPath: 'tsconfig.json' },

  poweredByHeader: false,
  compress: true,
  generateEtags: true,

  // ⛔️ COMMENT OUT while stabilizing
  // modularizeImports: {
  //   'lucide-react': { transform: 'lucide-react/dist/esm/icons/{{member}}' }
  // },

  // ✅ Keep only a simple, safe alias that applies to BOTH server & client
  webpack: (config) => {
    const path = require('path');
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname, 'src'),
    };

    // ⛔️ REMOVE these – they can drop needed modules:
    // if (!dev) {
    //   config.optimization.usedExports = true;
    //   config.optimization.sideEffects = false;
    // }

    return config;
  },

  images: {
    formats: ['image/webp','image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  output: 'standalone',
  trailingSlash: false,
};

let withMDX;
try {
  withMDX = require('@next/mdx')({
    extension: /\.mdx?$/,
    options: { remarkPlugins: [], rehypePlugins: [], providerImportSource: '@mdx-js/react' },
  });
} catch { withMDX = (c) => c; }

let withBundleAnalyzer = (c) => c;
if (process.env.ANALYZE === 'true') {
  try {
    withBundleAnalyzer = require('@next/bundle-analyzer')({ enabled: true });
  } catch { withBundleAnalyzer = (c) => c; }
}

module.exports = withBundleAnalyzer(withMDX(nextConfig));