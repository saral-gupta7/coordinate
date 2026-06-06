"use server";

import {
  CreateCourseInput,
  createCourseSchema,
} from "../schemas/course.schema";

export async function createCoursePlanAction(input: CreateCourseInput) {
  const parsed = createCourseSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      error: "Invalid course creation!",
      issues: parsed.error,
    };
  }

  const fastApiBaseUrl =
    process.env.FASTAPI_BASE_URL ?? "http://localhost:8000";
  const response = await fetch(
    `${fastApiBaseUrl}/internal/agents/course-plan`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsed.data),
    },
  );

  const data = await response.json();

  return {
    ok: true,
    data,
  };
}
