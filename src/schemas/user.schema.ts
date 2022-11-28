import { isValidObjectId } from "mongoose";
import { object, string, boolean, TypeOf } from "zod";
import { UserRole } from "../models/user.model";

export const UserIdSchema = string().refine(
  (userId) => isValidObjectId(userId),
  {
    message: "Некорректный ID пользователя",
  }
);

export const CreateUserSchema = object({
  body: object({
    name: string({
      required_error: "Имя пользователя обязательно",
    }),
    lastname: string({
      required_error: "Фамилия пользователя обязательна",
    }),
    email: string({
      required_error: "Email адрес обязателен",
    }).email("Некорректный email"),
    password: string({
      required_error: "Пароль обязателен",
    }).min(8, "Пароль должен состоять минимум из 8 символов"),
  }),
});
export type CreateUserReq = TypeOf<typeof CreateUserSchema>;

export const ActivateUserSchema = object({
  params: object({
    user: UserIdSchema,
    activatecode: string(),
  }),
});
export type ActivateUserReq = TypeOf<typeof ActivateUserSchema>;

export const LoginUserSchema = object({
  body: object({
    email: string({
      required_error: "Email адрес обязателен",
    }).email("Некорректный email"),
    password: string({
      required_error: "Пароль обязателен",
    }).min(8, "Пароль должен состоять минимум из 8 символов"),
    remember: boolean(),
  }),
});
export type LoginUserReq = TypeOf<typeof LoginUserSchema>;

export const RefreshSchema = object({
  query: object({
    remember: boolean().optional(),
  }),
});
export type RefreshReq = TypeOf<typeof RefreshSchema>;

export const SwitchRoleSchema = object({
  params: object({
    userId: UserIdSchema,
  }),
  body: object({
    role: string().refine(
      (role) => Object.values<string>(UserRole).includes(role),
      {
        message: "Неккоректная роль",
      }
    ),
  }),
});
export type SwitchRoleReq = TypeOf<typeof SwitchRoleSchema>;

export const UpdatePasswordSchema = object({
  body: object({
    password: string({
      required_error: "Пароль обязателен",
    }),
    newPassword: string({
      required_error: "Пароль обязателен",
    }).min(8, "Пароль должен состоять минимум из 8 символов"),
  }).refine(({ password, newPassword }) => password !== newPassword, {
    message: "Новый пароль должен отличаться",
  }),
});
export type UpdatePasswordReq = TypeOf<typeof UpdatePasswordSchema>;
