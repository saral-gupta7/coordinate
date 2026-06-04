import { z } from "zod";

const createCourseSchema = z.object({
  id: z.string(),
});
