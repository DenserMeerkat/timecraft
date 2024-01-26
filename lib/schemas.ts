import * as z from "zod";

export const facultySchema = z.object({
  code: z.string(),
  name: z.string().optional(),
  occupiedSlots: z.array(z.number()).optional(),
});

export const courseSchema = z.object({
  code: z.string(),
  name: z.string().optional(),
  faculties: z.array(facultySchema),
  hours: z.number(),
  hoursDistribution: z.array(z.number()).optional(),
  studentGroup: z.string(),
});

export const joinCoursesSchema = z.object({
  courses: z.array(courseSchema),
  fixedSlots: z.array(z.number()).optional(),
});