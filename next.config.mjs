/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8080',
  },
  async rewrites() {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8080';
    return [
      {
        source: '/api/:path*',
        destination: `${serverUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
