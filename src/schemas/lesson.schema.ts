import { object, string, TypeOf, intersection, boolean } from "zod";
import { isValidObjectId } from "mongoose";
import { ModuleIdSchema } from "./module.schema";

export const LessonIdSchema = string().refine((id) => isValidObjectId(id), {
  message: "Некорректный ID урока",
});
export const LessonSchema = object({
  title: string({
    required_error: "Поле title не может быть пустым",
  }),
  description: string({
    required_error: "Поле description не может быть пустым",
  }),
  content: string({
    required_error: "Поле content не может быть пустым",
  }),
  withExercise: boolean(),
  exercise: string().optional(),
});

export const CreateLessonSchema = object({
  body: intersection(
    LessonSchema,
    object({
      moduleId: ModuleIdSchema,
    })
  ),
});
export type CreateLessonType = TypeOf<typeof CreateLessonSchema>;

export const UpdateLessonSchema = object({
  params: object({
    lessonId: LessonIdSchema,
  }),
  body: LessonSchema,
});
export type UpdateLessonType = TypeOf<typeof UpdateLessonSchema>;

export const GetLessonSchema = object({
  params: object({
    lessonId: LessonIdSchema,
  }),
});
export type GetLessonType = TypeOf<typeof GetLessonSchema>;
