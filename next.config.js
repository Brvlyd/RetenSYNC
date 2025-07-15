/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    domains: ['localhost', 'retensync.vercel.app'],
  },
  // Remove output: 'export' to allow dynamic routes
  // output: 'export',
};

module.exports = nextConfig;
