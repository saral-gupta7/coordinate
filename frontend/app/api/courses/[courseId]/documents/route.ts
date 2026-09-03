import { auth } from '@/lib/auth';
import { requireServerEnv } from '@/lib/server-env';
import { headers } from 'next/headers';

function fastApiHeaders(userId: string, userEmail?: string | null) {
  return {
    Authorization: `Bearer ${requireServerEnv('FASTAPI_INTERNAL_TOKEN')}`,
    'X-User-Id': userId,
    'X-User-Email': userEmail ?? '',
  };
}

function forward(response: Response) {
  return new Response(response.body, {
    status: response.status,
    headers: {
      'Content-Type': response.headers.get('Content-Type') ?? 'application/json',
    },
  });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ courseId: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user.id) {
    return Response.json({ detail: 'Unauthorized.' }, { status: 401 });
  }

  const { courseId } = await params;
  const baseUrl = process.env.FASTAPI_BASE_URL ?? 'http://127.0.0.1:8000';
  const response = await fetch(
    `${baseUrl}/internal/rag/courses/${encodeURIComponent(courseId)}/documents`,
    {
      headers: fastApiHeaders(session.user.id, session.user.email),
      cache: 'no-store',
    },
  );
  return forward(response);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ courseId: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user.id) {
    return Response.json({ detail: 'Unauthorized.' }, { status: 401 });
  }

  const incoming = await request.formData();
  const file = incoming.get('file');
  if (!(file instanceof File)) {
    return Response.json({ detail: 'A PDF file is required.' }, { status: 400 });
  }

  const payload = new FormData();
  payload.set('file', file, file.name);
  const { courseId } = await params;
  const baseUrl = process.env.FASTAPI_BASE_URL ?? 'http://127.0.0.1:8000';
  const response = await fetch(
    `${baseUrl}/internal/rag/courses/${encodeURIComponent(courseId)}/documents`,
    {
      method: 'POST',
      headers: fastApiHeaders(session.user.id, session.user.email),
      body: payload,
    },
  );
  return forward(response);
}
