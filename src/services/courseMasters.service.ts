import { ObjectId } from "mongoose";
import ApiError from "../exceptions/ApiError";
import courseMasterModel from "../models/courseMaster.model";
import courseModel from "../models/course.model";
import userModel, { UserRole } from "../models/user.model";

class CourseMastersService {
  async createCourseMaster(user: ObjectId | string, course: ObjectId | string) {
    const PrevMaster = await courseMasterModel.findOne({ user, course });
    if (PrevMaster) {
      throw ApiError.BadRequest("Курс уже доступен пользователю");
    }
    const User = await userModel.findById(user);
    if (!User) {
      throw ApiError.BadRequest("Пользователь не найден");
    }
    const Course = await courseModel.findById(course);
    if (!Course) {
      throw ApiError.BadRequest("Курс не найден");
    }
    if (!(User.role == UserRole.teacher || User.role == UserRole.curator)) {
      throw ApiError.BadRequest(
        "Пользователь не является преподавателем или куратором"
      );
    }
    const Master = await courseMasterModel.create({ user, course });
    return Master;
  }
  async getCourseMaster(user: ObjectId | string, course: ObjectId | string) {
    const Master = await courseMasterModel.findOne({ user, course });
    if (!Master) {
      throw ApiError.BadRequest("Доступ к курсу не найден");
    }
    return Master;
  }

  async getCourseMasterAccess(user: string, course: string) {
    const Master = await courseMasterModel.findOne({
      user,
      course,
      isAvailable: true,
    });
    if (!Master) {
      throw ApiError.Forbidden();
    }
    return true;
  }
  async updateCourseMasterAccess(
    user: string,
    course: string,
    isAvailable: boolean
  ) {
    const Master = await courseMasterModel.findOneAndUpdate(
      { user, course },
      { isAvailable },
      {
        new: true,
      }
    );
    if (!Master) {
      throw ApiError.BadRequest("Доступ к курсу не найден");
    }
    return Master;
  }
}
export default new CourseMastersService();
