import { NextFunction, Request, Response } from "express";
import ApiError from "../exceptions/ApiError";
import { UserRole } from "../models/user.model";
import courseDataService from "../services/courseData.service";
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
  async getUserProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req.params;
      const UserProfile = await userService.getUserProfile(user);
      const UserCourses = await courseDataService.getUserCourses(user);
      res.json({ user: UserProfile, courses: UserCourses });
    } catch (e) {
      next(e);
    }
  }
  async setUserRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req.params;
      const { role } = req.body;
      if (!(role in UserRole)) {
        next(ApiError.BadRequest("Некорректная роль"));
      }
      const User = await userService.setUserRole(user, role);
      res.json(User);
    } catch (e) {
      next(e);
    }
  }
  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req.params;
      await userService.deleteUser(user);
      res.json("Пользователь был удален");
    } catch (e) {
      next(e);
    }
  }

  // to other router

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.user;
      const { name, lastname, ...info } = req.body;
      const User = await userService.updateUser(id, {
        name,
        lastname,
      });
      const userinfo = await userService.updateUserinfo(id, info);
      res.json({ ...User, userinfo });
    } catch (e) {
      next(e);
    }
  }
  async updatePassword(req: Request, res: Response, next: NextFunction) {
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
