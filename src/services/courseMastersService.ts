import courseModel from "src/models/courseModel";
import userModel, { UserRole } from "src/models/userModel";

const ApiError = require("../exceptions/ApiError");
const CourseMasterDto = require("../dtos/CourseMasterDto");
const courseMasterModel = require("../models/courseMasterModel");

class CourseMastersService {
  async createCourseMaster(user: string, course: string) {
    const PrevMaster = await courseMasterModel.findOne({ user, course });
    if (PrevMaster) {
      throw new ApiError.BadRequest("Курс уже доступен пользователю");
    }
    const User = await userModel.findById(user);
    if (!User) {
      throw new ApiError.BadRequest("Пользователь не найден");
    }
    const Course = await courseModel.findById(course);
    if (!Course) {
      throw new ApiError.BadRequest("Курс не найден");
    }
    if (!(User.role == UserRole.teacher || User.role == UserRole.curator)) {
      throw new ApiError.BadRequest(
        "Пользователь не является преподавателем или куратором"
      );
    }
    const Master = await courseMasterModel.create({ user, course });
    return new CourseMasterDto(Master);
  }

  async updateCourseMasterAccess(id: string, isAvailable: boolean) {
    const Master = await courseMasterModel.findByIdAndUpdate(
      id,
      { isAvailable },
      {
        new: true,
      }
    );
    if (!Master) {
      throw ApiError.BadRequest("Доступ к курсу не найден");
    }
    return new CourseMasterDto(Master);
  }

  async getCourseMaster(user: string, course: string) {
    const Master = await courseMasterModel.findOne({ user, course });
    if (!Master) {
      throw ApiError.BadRequest("Доступ к курсу не найден");
    }
    return new CourseMasterDto(Master);
  }
}
export default new CourseMastersService();
