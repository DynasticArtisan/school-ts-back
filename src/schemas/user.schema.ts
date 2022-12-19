import { isValidObjectId } from "mongoose";
import { object, string, boolean, TypeOf, number } from "zod";
import { UserRole } from "../models/user.model";

export const UserIdSchema = string().refine((id) => isValidObjectId(id), {
  message: "Некорректный ID пользователя",
});
const UserEmailSchema = string({
  required_error: "Email адрес обязателен",
}).email("Некорректный email");
const UserPasswordSchema = string({
  required_error: "Пароль обязателен",
}).min(8, "Пароль должен состоять минимум из 8 символов");
const UserRoleSchema = string().refine(
  (role) => Object.values<string>(UserRole).includes(role),
  {
    message: "Неккоректная роль",
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
    email: UserEmailSchema,
    password: UserPasswordSchema,
  }),
});
export type CreateUserReq = TypeOf<typeof CreateUserSchema>;

export const ActivateUserSchema = object({
  params: object({
    userId: UserIdSchema,
    activatecode: string(),
  }),
});
export type ActivateUserType = TypeOf<typeof ActivateUserSchema>;

export const LoginUserSchema = object({
  body: object({
    email: UserEmailSchema,
    password: UserPasswordSchema,
    remember: boolean(),
  }),
});
export type LoginUserType = TypeOf<typeof LoginUserSchema>;

export const ForgotPasswordSchema = object({
  body: object({
    email: UserEmailSchema,
  }),
});
export type ForgotPasswordType = TypeOf<typeof ForgotPasswordSchema>;

export const ResetPasswordSchema = object({
  params: object({
    userId: UserIdSchema,
    passwordResetCode: string(),
  }),
  body: object({
    password: UserPasswordSchema,
  }),
});
export type ResetPasswordType = TypeOf<typeof ResetPasswordSchema>;

export const GetUserSchema = object({
  params: object({
    userId: UserIdSchema,
  }),
});
export type GetUserType = TypeOf<typeof GetUserSchema>;

export const SwitchRoleSchema = object({
  params: object({
    userId: UserIdSchema,
  }),
  body: object({
    role: UserRoleSchema,
  }),
});
export type SwitchRoleType = TypeOf<typeof SwitchRoleSchema>;

export const UpdateProfileSchema = object({
  body: object({
    name: string({
      required_error: "Имя пользователя обязательно",
    }),
    lastname: string({
      required_error: "Фамилия пользователя обязательна",
    }),
    birthday: string().optional(),
    phone: string().optional(),
    city: string().optional(),
    gender: string().optional(),
    status: string().optional(),
    avatar: number().optional(),
  }),
});
export type UpdateProfileType = TypeOf<typeof UpdateProfileSchema>;

export const UpdatePasswordSchema = object({
  body: object({
    password: UserPasswordSchema,
    newPassword: UserPasswordSchema,
  }).refine(({ password, newPassword }) => password !== newPassword, {
    message: "Новый пароль должен отличаться",
  }),
});
export type UpdatePasswordType = TypeOf<typeof UpdatePasswordSchema>;
