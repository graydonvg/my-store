/** @type {import('next').NextConfig} */
const nextConfig = {
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
        hostname: 'www.apetogentleman.com',
      },
    ],
  },
};

module.exports = nextConfig;
