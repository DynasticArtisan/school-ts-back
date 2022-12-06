import { isValidObjectId } from "mongoose";
import { object, string, TypeOf, intersection } from "zod";
import { CourseIdSchema } from "./course.schema";
import { LessonSchema } from "./lesson.schema";

export const ModuleIdSchema = string().refine(
  (course) => isValidObjectId(course),
  {
    message: "Некорректный ID модуля",
  }
);
const ModuleSchema = object({
  title: string({
    required_error: "Поле title не может быть пустым",
  }),
  description: string({
    required_error: "Поле description не может быть пустым",
  }),
});

export const CreateModuleSchema = object({
  body: intersection(
    object({
      courseId: CourseIdSchema,
    }),
    ModuleSchema
  ),
});
export type CreateModuleType = TypeOf<typeof CreateModuleSchema>;

export const UpdateModuleSchema = object({
  params: object({
    moduleId: ModuleIdSchema,
  }),
  body: ModuleSchema,
});
export type UpdateModuleType = TypeOf<typeof UpdateModuleSchema>;

export const GetModuleSchema = object({
  params: object({
    moduleId: ModuleIdSchema,
  }),
});
export type GetModuleType = TypeOf<typeof GetModuleSchema>;

export const CreateLessonSchema = object({
  params: object({
    moduleId: ModuleIdSchema,
  }),
  body: LessonSchema,
});
export type CreateLessonType = TypeOf<typeof CreateLessonSchema>;
