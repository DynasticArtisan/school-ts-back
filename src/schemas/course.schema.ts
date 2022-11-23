import { isValidObjectId } from "mongoose";
import { object, string, TypeOf } from "zod";

export const CourseIdSchema = string().refine(
  (courseId) => isValidObjectId(courseId),
  {
    message: "Некорректный ID курса",
  }
);

export const CreateCourseSchema = object({
  body: object({
    title: string({
      required_error: "Название курса обязательно",
    }),
    subtitle: string({
      required_error: "Краткое описание обязательно",
    }),
    description: string({
      required_error: "Подробное описание обязательно",
    }),
  }),
});
export type CreateCourseReq = TypeOf<typeof CreateCourseSchema>;

export const UpdateCourseSchema = object({
  params: object({
    course: CourseIdSchema,
  }),
  body: object({
    title: string({
      required_error: "Название курса обязательно",
    }),
    subtitle: string({
      required_error: "Краткое описание обязательно",
    }),
    description: string({
      required_error: "Подробное описание обязательно",
    }),
  }),
});
export type UpdateCourseReq = TypeOf<typeof UpdateCourseSchema>;
