import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure proper handling for Netlify
  trailingSlash: false,
  generateEtags: false
};

export default nextConfig;
