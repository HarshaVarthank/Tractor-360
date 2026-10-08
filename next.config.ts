import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    DATABASE_URL: 'file:./dev.db',
    NEXTAUTH_SECRET: 'tractor360-enterprise-demo-secret-2026-production',
    AUTH_SECRET: 'tractor360-enterprise-demo-secret-2026-production',
  },
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],
  outputFileTracingIncludes: {
    '/**': ['./prisma/dev.db'],
  },
};

export default nextConfig;
