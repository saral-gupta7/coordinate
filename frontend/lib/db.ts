import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

import { requireServerEnv } from './server-env';

const adapter = new PrismaPg({
  connectionString: requireServerEnv('DATABASE_URL'),
  connectionTimeoutMillis: 5_000,
  idleTimeoutMillis: 10_000,
});

declare global {
  var __prisma: PrismaClient | undefined;
}

export const prisma = globalThis.__prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}
