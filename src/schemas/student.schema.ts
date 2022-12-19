import { isValidObjectId } from "mongoose";
import { boolean, object, string, TypeOf } from "zod";
import { CourseProgressFormat } from "../models/courseProgress.model";
import { CourseIdSchema } from "./course.schema";
import { UserIdSchema } from "./user.schema";

export const StudentIdSchema = string().refine((id) => isValidObjectId(id), {
  message: "Некорректный ID студента",
});
export const StudentSchema = object({
  courseId: CourseIdSchema,
  userId: UserIdSchema,
  format: string().refine(
    (format) => Object.values<string>(CourseProgressFormat).includes(format),
    {
      message: "Некорректный формат обучения",
    }
  ),
});

export const CreateStudentSchema = object({
  body: StudentSchema,
});
export type CreateStudentType = TypeOf<typeof CreateStudentSchema>;

export const GetStudentSchema = object({
  params: object({
    studentId: StudentIdSchema,
  }),
});
export type GetStudentType = TypeOf<typeof GetStudentSchema>;

export const UpdStudentAccessSchema = GetStudentSchema.merge(
  object({
    body: object({
      isAvailable: boolean(),
    }),
  })
);
export type UpdStudentAccessType = TypeOf<typeof UpdStudentAccessSchema>;
