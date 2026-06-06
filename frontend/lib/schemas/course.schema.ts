import { z } from "zod";

export const createCourseSchema = z.object({
  topic: z.string().min(2).max(120),
  goal: z.string().min(2).max(500),
  experience_level: z.enum(["beginner", "intermediate", "advanced"]),
  preferred_style: z.string().min(2).max(80),
  weekly_commitment: z.coerce.number().int().min(1).max(40),
  learning_mode: z.string().min(2).max(80),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;

export type AgentTraceStep = {
  order: number;
  node_name: string;
  status: "pending" | "running" | "failed" | "completed";
  summary: string | null;
};

export type ChapterPlan = {
  title: string;
  description: string;
  order: number;
  learning_outcomes: string[];
  estimated_duration: number;
};

export type CourseBlueprint = {
  title: string;
  description: string;
  goal: string;
  experience_level: "beginner" | "intermediate" | "advanced";
  learning_mode: string;
  preferred_style: string;
  weekly_commitment: number;
  prerequisites: string[];
  learning_objectives: string[];
  assessment_plan: string[];
  final_project: string;
  chapters: ChapterPlan[];
};

export type CoursePlanResponse = {
  agent_run_id: string;
  status: "failed" | "completed";
  course: CourseBlueprint | null;
  trace: AgentTraceStep[];
};
