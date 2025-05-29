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
  webpack: (config) => {
    // Configuration pour le hot reload dans Docker
    config.watchOptions = {
      poll: 1000, // Vérifie les changements toutes les secondes
      aggregateTimeout: 300, // Délai avant de déclencher une reconstruction
    };
    return config;
  },
};

export default nextConfig;
