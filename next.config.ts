import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: '*.public.blob.vercel-storage.com' },
    ],
    localPatterns: [
      { pathname: '/**' },
    ],
  },
};

export default nextConfig;
