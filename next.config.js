/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    domains: ['localhost', 'retensync.vercel.app'],
  },
  // Ensure public assets are properly served
  async rewrites() {
    return [
      {
        source: '/assets/:path*',
        destination: '/assets/:path*',
      },
    ];
  },
  // Remove output: 'export' to allow dynamic routes
  // output: 'export',
};

module.exports = nextConfig;
