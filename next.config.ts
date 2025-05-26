import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "holomatch-images.s3.eu-west-3.amazonaws.com",
        port: "",
        pathname: "/**",
      }
    ]
  },
};

export default nextConfig;
