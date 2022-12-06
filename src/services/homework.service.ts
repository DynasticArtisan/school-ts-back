import ApiError from "../exceptions/ApiError";
import homeworkModel, { HomeworkStatus } from "../models/homework.model";
import homeworkFilesModel from "../models/homeworkFiles.model";
import homeworkVerifyModel from "../models/homeworkVerify.model";
import courseService from "./course.service";
import courseMastersService from "./courseMasters.service";
import courseProgressService from "./courseProgress.service";
import notificationService from "./notes.service";

class HomeworkService {
  async createHomework(
    lesson: string,
    user: string,
    filename: string,
    filepath: string
  ) {
    const Progress = await courseProgressService.getLessonProgressAccess(
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
    await homeworkFilesModel.create({
      homework: Homework._id,
      user,
      filename,
      filepath,
    });
    return await homeworkModel.findById(Homework._id).populate("files").lean();
  }
  async updateHomework(
    lesson: string,
    user: string,
    filename: string,
    filepath: string
  ) {
    await courseProgressService.getLessonProgressAccess(user, lesson);
    const Homework = await homeworkModel.findOneAndUpdate(
      { lesson, user, status: HomeworkStatus.reject },
      { status: HomeworkStatus.wait }
    );
    if (!Homework) {
      throw ApiError.BadRequest("Домашнее задание не найдено");
    }
    const Files = await homeworkFilesModel.create({
      homework: Homework._id,
      user,
      filename,
      filepath,
    });
    return await homeworkModel.findById(Homework._id).populate("files").lean();
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
    try {
      const Lesson = await courseService.getLesson(Homework.lesson);
      await notificationService.createHomeworkAcceptNote(
        String(Homework.user),
        Lesson
      );
    } catch (error) {}
    return Homework;
  }

  async rejectHomework(homework: string) {
    const Homework = await homeworkModel.findByIdAndUpdate(homework, {
      status: HomeworkStatus.reject,
    });
    if (!Homework) {
      throw ApiError.BadRequest("Домашнее задание не найдено");
    }
    try {
      const Lesson = await courseService.getLesson(Homework.lesson);
      await notificationService.createHomeworkRejectNote(
        String(Homework.user),
        Lesson
      );
    } catch (error) {}
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
