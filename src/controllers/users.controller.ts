import { NextFunction, Request, Response } from "express";
import ApiError from "../exceptions/ApiError";
import { UserRole } from "../models/user.model";
import {
  GetUserType,
  SwitchRoleType,
  UpdatePasswordType,
  UpdateProfileType,
} from "../schemas/user.schema";
import courseService from "../services/course.service";
import userService from "../services/user.service";

class UserController {
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const Users = await userService.getUsers();
      res.json(Users);
    } catch (e) {
      next(e);
    }
  }

  async getUserProfile(
    req: Request<GetUserType["params"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = req.params;
      const UserProfile = await userService.getUserProfile(userId);
      const UserCourses = await courseService.getProfileCourses(userId);
      res.json({ user: UserProfile, courses: UserCourses });
    } catch (e) {
      next(e);
    }
  }

  async setUserRole(
    req: Request<SwitchRoleType["params"], {}, SwitchRoleType["body"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = req.params;
      const { role } = req.body;
      const User = await userService.updateRole(userId, role);
      res.json(User);
    } catch (e) {
      next(e);
    }
  }

  async deleteUser(
    req: Request<GetUserType["params"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = req.params;
      await userService.deleteUser(userId);
      res.json("Пользователь был удален");
    } catch (e) {
      next(e);
    }
  }

  async updateProfile(
    req: Request<{}, {}, UpdateProfileType["body"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.user;
      const { name, lastname, ...info } = req.body;
      const User = await userService.updateUser(id, name, lastname);
      const userinfo = await userService.updateUserinfo(id, info);
      res.json({ ...User, userinfo });
    } catch (e) {
      next(e);
    }
  }
  async updatePassword(
    req: Request<{}, {}, UpdatePasswordType["body"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.user;
      const { password, newPassword } = req.body;
      await userService.updatePassword(id, password, newPassword);
      res.send();
    } catch (e) {
      next(e);
    }
  }
}
export default new UserController();
