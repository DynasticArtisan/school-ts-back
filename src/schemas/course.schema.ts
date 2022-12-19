import { isValidObjectId } from "mongoose";
import { object, string, TypeOf, boolean } from "zod";
import { CourseProgressFormat } from "../models/courseProgress.model";
import { UserIdSchema } from "./user.schema";

export const CourseIdSchema = string().refine((id) => isValidObjectId(id), {
  message: "Некорректный ID курса",
});
export const StudentIdSchema = string().refine((id) => isValidObjectId(id), {
  message: "Некорректный ID студента",
});
export const MasterIdSchema = string().refine((id) => isValidObjectId(id), {
  message: "Некорректный ID преподавателя",
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

export const CreateModuleSchema = object({
  params: object({
    courseId: CourseIdSchema,
  }),
  body: object({
    title: string({
      required_error: "Поле title не может быть пустым",
    }),
    description: string({
      required_error: "Поле description не может быть пустым",
    }),
  }),
});
export type CreateModuleType = TypeOf<typeof CreateModuleSchema>;

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

export const UpdateStudentSchema = object({
  params: object({
    courseId: CourseIdSchema,
    studentId: StudentIdSchema,
  }),
  body: object({
    isAvailable: boolean(),
  }),
});
export type UpdateStudentType = TypeOf<typeof UpdateStudentSchema>;

export const CreateTeacherSchema = object({
  params: object({
    courseId: CourseIdSchema,
  }),
  body: object({
    userId: UserIdSchema,
  }),
});
export type CreateTeacherType = TypeOf<typeof CreateTeacherSchema>;

export const UpdateTeacherAccessSchema = object({
  params: object({
    courseId: CourseIdSchema,
    masterId: MasterIdSchema,
  }),
  body: object({
    isAvailable: boolean(),
  }),
});
export type UpdateTeacherAccessType = TypeOf<typeof UpdateTeacherAccessSchema>;

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
