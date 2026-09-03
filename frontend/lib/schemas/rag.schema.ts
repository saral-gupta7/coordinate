export type KnowledgeDocumentStatus = 'processing' | 'ready' | 'failed';

export type KnowledgeDocument = {
  id: string;
  course_id: string;
  filename: string;
  mime_type: string;
  status: KnowledgeDocumentStatus;
  page_count: number;
  chunk_count: number;
  error_message: string | null;
  created_at: string;
  updated_at: string;
};
