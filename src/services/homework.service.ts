import TokenDto from "../dtos/token.dto";
import ApiError from "../exceptions/ApiError";
import homeworkModel, { HomeworkStatus } from "../models/homework.model";
import homeworkVerifyModel from "../models/homeworkVerify.model";
import { UserRole } from "../models/user.model";
import courseMastersService from "./courseMasters.service";
import courseProgressService from "./courseProgress.service";

class HomeworkService {
  async getHomeworkByRoles(homework: string, user: TokenDto) {
    switch (user.role) {
      case UserRole.teacher || UserRole.curator:
        const MasterHomework = await this.getHomework(homework);
        await courseMastersService.getCourseMaster(
          user.id,
          MasterHomework.course
        );
        return MasterHomework;
      case UserRole.super:
        const Homework = await this.getHomework(homework);
        return Homework;
      default:
        throw ApiError.Forbidden();
    }
  }
  async acceptHomeworkByRoles(homework: string, user: TokenDto) {
    switch (user.role) {
      case UserRole.teacher || UserRole.curator:
        await this.verifyHomework(homework, user.id);
        const MasterAcceptedHomework = await this.acceptHomework(homework);
        return MasterAcceptedHomework;
      case UserRole.super:
        const AcceptedHomework = await this.acceptHomework(homework);
        return AcceptedHomework;
      default:
        throw ApiError.Forbidden();
    }
  }
  async rejectHomeworkByRoles(homework: string, user: TokenDto) {
    switch (user.role) {
      case UserRole.teacher || UserRole.curator:
        await this.verifyHomework(homework, user.id);
        const MasterRejectedHomework = await this.rejectHomework(homework);
        return MasterRejectedHomework;
      case UserRole.super:
        const RejectedHomework = await this.rejectHomework(homework);
        return RejectedHomework;
      default:
        throw ApiError.Forbidden();
    }
  }
  // -------------------------------------------------------------

  async createHomework(
    lesson: string,
    user: string,
    filename: string,
    filepath: string
  ) {
    const Progress = await courseProgressService.getLessonProgress(
      user,
      lesson
    );
    const PrevHomework = await homeworkModel.findOne({
      user,
      lesson,
    });
    if (PrevHomework) {
      throw ApiError.BadRequest("Домашнее задание уже было создано");
    }
    const Homework = await homeworkModel.create({
      user,
      lesson,
      course: Progress.course,
    });

    return Homework;
  }

  async updateHomework(
    lesson: string,
    user: string,
    filename: string,
    filepath: string
  ) {
    const Progress = await courseProgressService.getLessonProgress(
      user,
      lesson
    );
    const Homework = await homeworkModel.findOneAndUpdate(
      { lesson, user, status: HomeworkStatus.reject },
      { status: HomeworkStatus.wait }
    );
    if (!Homework) {
      throw ApiError.BadRequest("Домашнее задание не найдено");
    }

    return Homework;
  }

  async getHomework(homework: string) {
    const Homework = await homeworkModel
      .findById(homework)
      .populate("user")
      .populate("files")
      .lean();
    if (!Homework) {
      throw ApiError.BadRequest("Домашнее задание не найдено");
    }
    return Homework;
  }
  async acceptHomework(homework: string) {
    const Homework = await homeworkModel.findByIdAndUpdate(homework, {
      status: HomeworkStatus.accept,
    });
    if (!Homework) {
      throw ApiError.BadRequest("Домашнее задание не найдено");
    }
    // notification
    return Homework;
  }
  async rejectHomework(homework: string) {
    const Homework = await homeworkModel.findByIdAndUpdate(homework, {
      status: HomeworkStatus.reject,
    });
    if (!Homework) {
      throw ApiError.BadRequest("Домашнее задание не найдено");
    }
    // notification
    return Homework;
  }
  async verifyHomework(homework: string, user: string) {
    const Homework = await homeworkModel.findById(homework);
    if (!Homework) {
      throw ApiError.BadRequest("Домашнее задание не найдено");
    }
    await courseMastersService.getCourseMaster(user, Homework.course);
    const PrevVerified = await homeworkVerifyModel.findOne({ homework, user });
    if (PrevVerified) {
      return PrevVerified;
    }
    const Verify = await homeworkVerifyModel.create({ homework, user });
    return Verify;
  }
}

export default new HomeworkService();
