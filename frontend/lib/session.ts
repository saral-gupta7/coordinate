import { headers } from 'next/headers';
import type { NextRequest } from 'next/server';
import { cache } from 'react';

import { auth } from './auth';

export const getSession = async (request: NextRequest) => {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  return session ?? null;
};

export const getCurrentSession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session ?? null;
});
