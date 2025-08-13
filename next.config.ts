import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    serverExternalPackages: ['@netlify/functions']
  },
  // Ensure proper handling for Netlify
  trailingSlash: false,
  generateEtags: false
};

export default nextConfig;
