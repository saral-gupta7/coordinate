import { auth } from '@/lib/auth';
import { requireServerEnv } from '@/lib/server-env';
import { headers } from 'next/headers';

export async function DELETE(
  _request: Request,
  {
    params,
  }: { params: Promise<{ courseId: string; documentId: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user.id) {
    return Response.json({ detail: 'Unauthorized.' }, { status: 401 });
  }

  const { courseId, documentId } = await params;
  const baseUrl = process.env.FASTAPI_BASE_URL ?? 'http://127.0.0.1:8000';
  const response = await fetch(
    `${baseUrl}/internal/rag/courses/${encodeURIComponent(courseId)}/documents/${encodeURIComponent(documentId)}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${requireServerEnv('FASTAPI_INTERNAL_TOKEN')}`,
        'X-User-Id': session.user.id,
        'X-User-Email': session.user.email ?? '',
      },
    },
  );

  if (response.status === 204) {
    return new Response(null, { status: 204 });
  }
  return new Response(response.body, {
    status: response.status,
    headers: {
      'Content-Type': response.headers.get('Content-Type') ?? 'application/json',
    },
  });
}
