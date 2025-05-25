import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  images: {
    remotePatterns: [
      new URL("https://holomatch-images.s3.eu-west-3.amazonaws.com/**")
    ]
  },
};

export default nextConfig;
