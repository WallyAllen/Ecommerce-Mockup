import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow mobile testing on local network
  allowedDevOrigins: [
    "192.168.1.34",
    "192.168.1.34:3000",
    "localhost",
    "localhost:3000"
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
