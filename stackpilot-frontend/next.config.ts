/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // Optimized for deployment
  images: {
    domains: ["stackpilot-backend.onrender.com"], // Add your backend domain
  },
};

module.exports = nextConfig;
