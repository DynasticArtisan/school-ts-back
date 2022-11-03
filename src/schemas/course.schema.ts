import { isValidObjectId } from "mongoose";
import { object, string, TypeOf } from "zod";

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
    course: string().refine((course) => isValidObjectId(course), {
      message: "Некорректный ID курса",
    }),
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
