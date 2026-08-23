import { z } from 'zod';

function looksMeaningful(value: string) {
  const normalized = value.toLowerCase().replace(/[^a-z0-9+#.]/g, '');
  return /[a-z]/i.test(value) && new Set(normalized).size >= 3;
}

export const createCourseSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(10, 'Tell us a little more about what you want to learn.')
    .max(2000, 'Keep your request under 2,000 characters.')
    .refine(looksMeaningful, 'Enter something meaningful.'),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;

export type AgentTraceStep = {
  order: number;
  node_name: string;
  status: 'pending' | 'running' | 'failed' | 'completed';
  summary: string | null;
};

export const chapterPlanSchema = z.object({
  title: z.string().min(2).max(120),
  description: z.string().min(10).max(800),
  order: z.number().int().min(1).max(30),
  learning_outcomes: z.array(z.string()).min(1).max(8),
  estimated_duration: z.number().int().min(5).max(600),
});

export type ChapterPlan = z.infer<typeof chapterPlanSchema>;

export const courseBlueprintSchema = z.object({
  title: z.string().min(2).max(140),
  description: z.string().min(20).max(1200),
  goal: z.string().min(5).max(500),
  experience_level: z.enum(['beginner', 'intermediate', 'advanced']),
  course_depth: z.enum(['quick_start', 'standard', 'comprehensive']),
  prerequisites: z.array(z.string()).max(12),
  learning_objectives: z.array(z.string()).min(1).max(12),
  assessment_plan: z.array(z.string()).min(1).max(12),
  final_project: z.string().min(10).max(1200),
  chapters: z.array(chapterPlanSchema).min(3).max(12),
});

export type CourseBlueprint = z.infer<typeof courseBlueprintSchema>;

export const reviseCourseSchema = z.object({
  prompt: createCourseSchema.shape.prompt,
  course: courseBlueprintSchema,
  feedback: z
    .string()
    .trim()
    .min(5, 'Describe the changes you would like to see.')
    .max(2000, 'Keep your feedback under 2,000 characters.')
    .refine(looksMeaningful, 'Enter something meaningful.'),
});

export const acceptCourseSchema = z.object({
  prompt: createCourseSchema.shape.prompt,
  course: courseBlueprintSchema,
});

export type CoursePlanResponse = {
  agent_run_id: string;
  status: 'failed' | 'awaiting_review' | 'completed';
  course: CourseBlueprint | null;
  trace: AgentTraceStep[];
};
