import { isValidObjectId } from "mongoose";
import { object, string, TypeOf, boolean } from "zod";
import { CourseProgressFormat } from "../models/courseProgress.model";
import { UserIdSchema } from "./user.schema";

export const CourseIdSchema = string().refine((id) => isValidObjectId(id), {
  message: "Некорректный ID курса",
});
export const CourseInputSchema = object({
  title: string({
    required_error: "Название курса обязательно",
  }),
  subtitle: string({
    required_error: "Краткое описание обязательно",
  }),
  description: string({
    required_error: "Подробное описание обязательно",
  }),
});

export const CreateCourseSchema = object({
  body: CourseInputSchema,
});
export type CreateCourseType = TypeOf<typeof CreateCourseSchema>;

export const GetCourseSchema = object({
  params: object({
    courseId: CourseIdSchema,
  }),
});
export type GetCourseType = TypeOf<typeof GetCourseSchema>;

export const UpdateCourseSchema = object({
  params: object({
    courseId: CourseIdSchema,
  }),
  body: CourseInputSchema,
});
export type UpdateCourseType = TypeOf<typeof UpdateCourseSchema>;

export const CreateStudentSchema = object({
  params: object({
    courseId: CourseIdSchema,
  }),
  body: object({
    userId: UserIdSchema,
    format: string().refine(
      (format) => Object.values<string>(CourseProgressFormat).includes(format),
      {
        message: "Некорректный формат обучения",
      }
    ),
  }),
});
export type CreateStudentType = TypeOf<typeof CreateStudentSchema>;

export const CreateTeacherSchema = object({
  params: object({
    courseId: CourseIdSchema,
  }),
  body: object({
    userId: UserIdSchema,
  }),
});
export type CreateTeacherType = TypeOf<typeof CreateTeacherSchema>;

export const GetStudentSchema = object({
  params: object({
    courseId: CourseIdSchema,
    userId: UserIdSchema,
  }),
});
export type GetStudentType = TypeOf<typeof GetStudentSchema>;

export const UpdateAccessSchema = object({
  params: object({
    courseId: CourseIdSchema,
    userId: UserIdSchema,
  }),
  body: object({
    isAvailable: boolean(),
  }),
});
export type UpdateAccessType = TypeOf<typeof UpdateAccessSchema>;
