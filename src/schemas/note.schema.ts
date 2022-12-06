import { array, object, string, TypeOf } from "zod";
import { isValidObjectId } from "mongoose";
import { UserIdSchema } from "./user.schema";

export const TemplateIdSchema = string().refine((id) => isValidObjectId(id), {
  message: "Некорректный ID шаблона",
});
export const NoteIdSchema = string().refine((id) => isValidObjectId(id), {
  message: "Некорректный ID уведомления",
});
const TemplateSchema = object({
  title: string({
    required_error: "Поле title не может быть пустым",
  }),
  image: string().optional(),
  icon: string().optional(),
  body: string({
    required_error: "Поле body не может быть пустым",
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

export const UpdateTemplateSchema = object({
  params: object({
    templateId: TemplateIdSchema,
  }),
  body: TemplateSchema,
});
export type UpdateTemplateType = TypeOf<typeof UpdateTemplateSchema>;

export const CreateNoteSchema = object({
  params: object({
    templateId: TemplateIdSchema,
  }),
  body: object({
    users: array(UserIdSchema).nonempty(),
  }),
});
export type CreateNoteType = TypeOf<typeof CreateNoteSchema>;

export const GetNoteSchema = object({
  params: object({
    noteId: NoteIdSchema,
  }),
});
export type GetNoteType = TypeOf<typeof GetNoteSchema>;
