import { array, intersection, object, string, TypeOf } from "zod";
import { isValidObjectId } from "mongoose";
import { UserIdSchema } from "./user.schema";

export const TemplateIdSchema = string().refine((id) => isValidObjectId(id), {
  message: "Некорректный ID шаблона",
});

const TemplateSchema = object({
  title: string({
    required_error: "Поле title не может быть пустым",
  }),
  subject: string({
    required_error: "Поле subject не может быть пустым",
  }),
  html: string({
    required_error: "Поле html не может быть пустым",
  }),
});

export const CreateTemplateSchema = object({
  body: TemplateSchema,
});
export type CreateTemplateType = TypeOf<typeof CreateTemplateSchema>;

export const GetTemplateSchema = object({
  params: object({
    templateId: TemplateIdSchema,
  }),
});
export type GetTemplateType = TypeOf<typeof GetTemplateSchema>;

export const UpdateTemplateSchema =
  GetTemplateSchema.merge(CreateTemplateSchema);
export type UpdateTemplateType = TypeOf<typeof UpdateTemplateSchema>;

export const CreateMailsSchema = GetTemplateSchema.merge(
  object({
    body: object({
      users: array(UserIdSchema).nonempty(),
    }),
  })
);
export type CreateMailsType = TypeOf<typeof CreateMailsSchema>;
