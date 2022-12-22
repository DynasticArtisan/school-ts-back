import { object, string, TypeOf } from "zod";
import { isValidObjectId } from "mongoose";

export const HomeworkIdSchema = string().refine((id) => isValidObjectId(id), {
  message: "Некорректный ID домашнего задания",
});

export const GetHomeworkSchema = object({
  params: object({
    homeworkId: HomeworkIdSchema,
  }),
});
export type GetHomeworkType = TypeOf<typeof GetHomeworkSchema>;

export const VerifyHomeworkSchema = GetHomeworkSchema.merge(
  object({
    body: object({
      comment: string().optional(),
    }),
  })
);
export type VerifyHomeworkType = TypeOf<typeof VerifyHomeworkSchema>;
