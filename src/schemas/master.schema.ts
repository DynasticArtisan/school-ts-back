import { isValidObjectId } from "mongoose";
import { boolean, object, string, TypeOf } from "zod";
import { CourseIdSchema } from "./course.schema";
import { UserIdSchema } from "./user.schema";

export const MasterIdSchema = string().refine((id) => isValidObjectId(id), {
  message: "Некорректный ID наставника",
});
export const MasterSchema = object({
  courseId: CourseIdSchema,
  userId: UserIdSchema,
});

export const CreateMasterSchema = object({
  body: MasterSchema,
});
export type CreatMasterType = TypeOf<typeof CreateMasterSchema>;

export const GetMasterSchema = object({
  params: object({
    masterId: MasterIdSchema,
  }),
});
export type GetMasterType = TypeOf<typeof GetMasterSchema>;

export const UpdMasterAccessSchema = GetMasterSchema.merge(
  object({
    body: object({
      isAvailable: boolean(),
    }),
  })
);
export type UpdMasterAccessType = TypeOf<typeof UpdMasterAccessSchema>;
