import { auth } from "./auth";

import type { NextRequest } from "next/server";

export const getSession = async (request: NextRequest) => {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  return session ?? null;
};
