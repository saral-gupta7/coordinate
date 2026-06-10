export type AgentTraceStep = {
  order: number;
  node_name: string;
  status: 'pending' | 'running' | 'failed' | 'completed';
  summary: string | null;
};

export type LessonResource = {
  title: string;
  type: string;
  reason: string;
};

export type LessonCitation = {
  label: string;
  note: string;
};

export type QuizQuestion = {
  question: string;
  options: string[];
  correct_answer_index: number;
  explanation: string;
  concept: string;
};

export type LessonQuiz = {
  questions: QuizQuestion[];
};

export type LessonBuildResponse = {
  agent_run_id: string;
  status: 'failed' | 'completed';
  markdown_content: string | null;
  quiz: LessonQuiz | null;
  project_task: string | null;
  resources: LessonResource[];
  citations: LessonCitation[];
  trace: AgentTraceStep[];
};

export type GenerateLessonActionResult =
  | {
      ok: true;
      data: {
        chapterId: string;
        lesson: LessonBuildResponse;
      };
    }
  | {
      ok: false;
      error: string;
      data?: LessonBuildResponse;
    };
