/** @type {import('next').NextConfig} */

import { withAxiom } from 'next-axiom';

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/v0/b/my-shop-7cfcc.appspot.com/o/**',
      },
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default withAxiom(nextConfig);
