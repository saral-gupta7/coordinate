import { createAuthClient } from 'better-auth/react';

// The auth API is mounted in this Next.js app, so relative same-origin
// requests are safer across local, preview, and production deployments.
export const authClient = createAuthClient();
