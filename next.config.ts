import type { NextConfig } from 'next';
const pages = process.env.GITHUB_PAGES === 'true';
const config: NextConfig = {
  poweredByHeader: false,
  ...(pages ? { output: 'export' as const, trailingSlash: true } : {}),
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  images: {
    unoptimized: pages,
    qualities: [75, 90],
    remotePatterns: [{ protocol: 'https', hostname: '**.rbxcdn.com' }],
  },
  ...(!pages ? { async headers() { return [{ source: '/(.*)', headers: [
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'X-Frame-Options', value: 'DENY' },
  ] }]; } } : {}),
};
export default config;
