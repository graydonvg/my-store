/** @type {import('next').NextConfig} */

const { withAxiom } = require('next-axiom');

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
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

module.exports = withAxiom(nextConfig);
