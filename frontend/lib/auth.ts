import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';

import { prisma } from './db';
import { requireServerEnv } from './server-env';

export const auth = betterAuth({
  baseURL: requireServerEnv('BETTER_AUTH_URL'),
  secret: requireServerEnv('BETTER_AUTH_SECRET'),
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  socialProviders: {
    github: {
      clientId: requireServerEnv('GITHUB_CLIENT_ID'),
      clientSecret: requireServerEnv('GITHUB_CLIENT_SECRET'),
    },
    google: {
      clientId: requireServerEnv('GOOGLE_CLIENT_ID'),
      clientSecret: requireServerEnv('GOOGLE_CLIENT_SECRET'),
    },
  },
});
