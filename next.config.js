/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    logging: 'verbose',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'i.dummyjson.com',
      },
      {
        //delete this. demo
        protocol: 'https',
        hostname: 'i5.walmartimages.com',
      },
    ],
  },
};

module.exports = nextConfig;
