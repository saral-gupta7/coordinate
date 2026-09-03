'use client';

import type { KnowledgeDocument } from '@/lib/schemas/rag.schema';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FileText, LoaderCircle, ShieldCheck, Trash2, Upload } from 'lucide-react';
import { useRef } from 'react';
import { toast } from 'sonner';

const MAX_FILE_BYTES = 8 * 1024 * 1024;

async function responseError(response: Response, fallback: string) {
  try {
    const payload = (await response.json()) as { detail?: string };
    return payload.detail ?? fallback;
  } catch {
    return fallback;
  }
}

export function CourseSources({ courseId }: { courseId: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const queryKey = ['course-documents', courseId];
  const { data = [], isPending } = useQuery<KnowledgeDocument[]>({
    queryKey,
    queryFn: async () => {
      const response = await fetch(`/api/courses/${courseId}/documents`);
      if (!response.ok) {
        throw new Error(await responseError(response, 'Could not load course sources.'));
      }
      return response.json();
    },
  });

  const upload = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.set('file', file);
      const response = await fetch(`/api/courses/${courseId}/documents`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error(await responseError(response, 'Could not index this PDF.'));
      }
      return response.json() as Promise<KnowledgeDocument>;
    },
    onSuccess: async (document) => {
      await queryClient.invalidateQueries({ queryKey });
      toast.success(
        `Indexed ${document.filename} into ${document.chunk_count} grounded chunks.`,
      );
      if (inputRef.current) inputRef.current.value = '';
    },
    onError: (error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (documentId: string) => {
      const response = await fetch(
        `/api/courses/${courseId}/documents/${documentId}`,
        { method: 'DELETE' },
      );
      if (!response.ok) {
        throw new Error(await responseError(response, 'Could not remove this source.'));
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey });
      toast.success('Course source removed.');
    },
    onError: (error) => toast.error(error.message),
  });

  function chooseFile(file?: File) {
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Choose a PDF file.');
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      toast.error('PDFs are limited to 8 MB.');
      return;
    }
    upload.mutate(file);
  }

  return (
    <section className="border-b py-8 sm:py-9" aria-labelledby="course-sources-title">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)]">
            <ShieldCheck className="size-4" />
            <h2 id="course-sources-title">Private course sources</h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Upload a text-based PDF. Coordinate retrieves only your course&apos;s
            most relevant pages and grounds new lessons with inspectable citations.
          </p>
        </div>
        <label className="focus-within:ring-2 focus-within:ring-[var(--accent)] inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border bg-[var(--surface)] px-4 py-2.5 text-xs font-semibold hover:border-[var(--accent)]">
          {upload.isPending ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <Upload className="size-4" />
          )}
          {upload.isPending ? 'Indexing PDF…' : 'Add PDF source'}
          <input
            accept="application/pdf,.pdf"
            className="sr-only"
            disabled={upload.isPending}
            onChange={(event) => chooseFile(event.target.files?.[0])}
            ref={inputRef}
            type="file"
          />
        </label>
      </div>

      <div className="mt-5 grid gap-3">
        {isPending ? (
          <p className="text-sm text-[var(--muted)]">Loading private sources…</p>
        ) : data.length === 0 ? (
          <div className="rounded-2xl border border-dashed px-5 py-4 text-sm text-[var(--muted)]">
            No private sources yet. Lessons will continue using the approved course plan.
          </div>
        ) : (
          data.map((document) => (
            <div
              className="flex items-center gap-3 rounded-2xl border bg-[var(--surface)] px-4 py-3"
              key={document.id}
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--surface-soft)] text-[var(--accent-strong)]">
                <FileText className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{document.filename}</p>
                <p className="mt-0.5 text-xs text-[var(--muted)]">
                  {document.page_count} pages · {document.chunk_count} chunks · {document.status}
                </p>
                {document.error_message && (
                  <p className="mt-1 text-xs text-red-600">{document.error_message}</p>
                )}
              </div>
              <button
                aria-label={`Remove ${document.filename}`}
                className="focus-ring grid size-9 shrink-0 place-items-center rounded-full border text-[var(--muted)] hover:text-red-600"
                disabled={remove.isPending}
                onClick={() => remove.mutate(document.id)}
                type="button"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
