/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // Optimized for deployment
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "stackpilot-backend.onrender.com",
      },
    ],
  },
};

module.exports = nextConfig;
