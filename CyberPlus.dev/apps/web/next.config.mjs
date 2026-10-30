/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep Postgres-compatible
  serverExternalPackages: ['argon2', '@prisma/client'],
};

export default nextConfig;

