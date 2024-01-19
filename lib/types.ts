import * as z from "zod";
import { courseSchema, facultySchema, joinCoursesSchema } from "./schemas";

export type Course = z.infer<typeof courseSchema>;

export type Faculty = z.infer<typeof facultySchema>;

export type JointCourseSchema = z.infer<typeof joinCoursesSchema>;

export type Schedule = {
  id: string;
  periods: number[];
};
