import { createNextConfig } from 'next';

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
};

export default createNextConfig(nextConfig);