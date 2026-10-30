/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['argon2', '@prisma/client'],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

