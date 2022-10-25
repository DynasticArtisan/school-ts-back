import { ObjectId } from "mongoose";
import ApiError from "../exceptions/ApiError";
import courseModel from "../models/course.model";
import courseProgressModel, {
  CourseProgressFormat,
} from "../models/courseProgress.model";
import lessonModel, { LessonDocument } from "../models/lesson.model";
import lessonProgressModel from "../models/lessonProgress.model";
import moduleModel, { ModuleDocument } from "../models/module.model";
import moduleProgressModel from "../models/moduleProgress.model";
import userModel from "../models/user.model";
import courseService from "./course.service";
import notificationService from "./notification.service";

const CourseProgressDto = require("../dtos/CourseProgressDto");
const ModuleProgressDto = require("../dtos/ModuleProgressDto");
const LessonProgressDto = require("../dtos/LessonProgressDto");

class CourseProgressService {
  async getCourseStudents(course: ObjectId | string) {
    const Students = await courseProgressModel
      .find({ course })
      .populate([
        {
          path: "user",
          select: "name surname",
        },
        {
          path: "lastLesson",
          populate: "lesson module",
        },
      ])
      .lean();
    return Students.map((progress) => new CourseProgressDto(progress));
  }

  async createCourseProgress(
    user: ObjectId | string,
    course: ObjectId | string,
    format: string
  ) {
    if (!(format in CourseProgressFormat)) {
      throw ApiError.BadRequest("Неверный формат");
    }
    const PrevProgress = await courseProgressModel.findOne({ user, course });
    if (PrevProgress) {
      throw ApiError.BadRequest("Курс уже доступен пользователю");
    }
    const User = await userModel.findOne({ _id: user, isActivated: true });
    const Course = await courseModel.findById(course);
    if (!User || !Course) {
      throw ApiError.BadRequest("Ползователь или курс не найден");
    }
    const Progress = await courseProgressModel.create({
      user,
      course,
      format,
      endAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    });
    return new CourseProgressDto(Progress);
  }
  async getCourseProgress(user: ObjectId | string, course: ObjectId | string) {
    const Progress = await courseProgressModel.findOne({
      user,
      course,
      isAvailable: true,
    });
    if (!Progress) {
      throw ApiError.BadRequest("Прогресс пользователя не найден");
    }
    return new CourseProgressDto(Progress);
  }
  async updateCourseProgressAccess(
    progress: ObjectId | string,
    isAvailable: boolean
  ) {
    const Progress = await courseProgressModel.findByIdAndUpdate(
      progress,
      { isAvailable },
      {
        new: true,
      }
    );
    if (!Progress) {
      throw ApiError.BadRequest("Прогресс пользователя не найден");
    }
    const Course = await courseService.getCourse(Progress.course);
    if (isAvailable) {
      await notificationService.createCourseUnlockNotif(
        String(Progress.user),
        Course
      );
    } else {
      await notificationService.createCourseLockNotif(
        String(Progress.user),
        Course
      );
    }
    return new CourseProgressDto(Progress);
  }
  async completeCourseProgress(
    user: ObjectId | string,
    course: ObjectId | string
  ) {
    const Progress = await courseProgressModel.findOneAndUpdate(
      { course, user },
      { isCompleted: true },
      { new: true }
    );
    if (!Progress) {
      throw ApiError.BadRequest("Прогресс пользователя не найден");
    }
    return new CourseProgressDto(Progress);
  }

  async createModuleProgress(
    user: ObjectId | string,
    module: ObjectId | string
  ) {
    const Module = await moduleModel.findById(module);
    if (!Module) {
      throw ApiError.BadRequest("Модуль не найден");
    }
    // а есть ли доступ к курсу?
    await this.getCourseProgress(user, Module.course);
    const PrevModule = await moduleModel.findOne({
      course: Module.course,
      index: Module.index - 1,
    });
    if (PrevModule) {
      const PrevModuleCompleted = await moduleProgressModel.findOne({
        user,
        module: PrevModule._id,
        isCompleted: true,
      });
      if (!PrevModuleCompleted) {
        throw ApiError.Forbidden();
      }
    }
    const Progress = await moduleProgressModel.create({
      user,
      module,
      course: Module.course,
    });
    return new ModuleProgressDto(Progress);
  }
  async getModuleProgress(user: ObjectId | string, module: ObjectId | string) {
    const PrevProgress = await moduleProgressModel.findOne({
      user,
      module,
      isAvailable: true,
    });
    if (PrevProgress) {
      // а есть ли доступ к курсу?
      await this.getCourseProgress(user, PrevProgress.course);
      return new ModuleProgressDto(PrevProgress);
    }
    const NewProgress = await this.createModuleProgress(user, module);
    return NewProgress;
  }
  async completeModuleProgress(
    user: ObjectId | string,
    module: ObjectId | string
  ) {
    const Progress = await moduleProgressModel
      .findOneAndUpdate({ user, module }, { isCompleted: true }, { new: true })
      .populate<{ module: ModuleDocument }>("module");
    if (!Progress) {
      throw ApiError.BadRequest("Прогресс пользователя не найден");
    }
    const NextModule = await moduleModel.findOne({
      course: Progress.course,
      index: Progress.module.index + 1,
    });
    if (!NextModule) {
      await this.completeCourseProgress(user, Progress.course);
    }
    return new ModuleProgressDto(Progress);
  }

  async createLessonProgress(
    user: ObjectId | string,
    lesson: ObjectId | string
  ) {
    const Lesson = await lessonModel.findById(lesson);
    if (!Lesson) {
      throw ApiError.BadRequest("Урок не найден");
    }
    // а есть ли доступ к модулю?
    await this.getModuleProgress(user, Lesson.module);
    const PrevLesson = await lessonModel.findOne({
      module: Lesson.module,
      index: Lesson.index - 1,
    });
    if (PrevLesson) {
      const PrevLessonCompleted = await lessonProgressModel.findOne({
        user,
        lesson: PrevLesson._id,
        isCompleted: true,
      });
      if (!PrevLessonCompleted) {
        throw ApiError.Forbidden();
      }
    }
    const Progress = await lessonProgressModel.create({
      user,
      lesson,
      module: Lesson.module,
      course: Lesson.course,
    });
    return Progress;
  }
  async getLessonProgress(user: ObjectId | string, lesson: ObjectId | string) {
    const PrevProgress = await lessonProgressModel.findOne({
      user,
      lesson,
      isAvailable: true,
    });
    if (PrevProgress) {
      // а есть ли доступ к курсу?
      await this.getCourseProgress(user, PrevProgress.course);
      return PrevProgress;
    }
    const NewProgress = await this.createLessonProgress(user, lesson);
    return NewProgress;
  }
  async completeLessonProgress(
    user: ObjectId | string,
    lesson: ObjectId | string
  ) {
    const Progress = await lessonProgressModel
      .findOneAndUpdate({ user, lesson }, { isCompleted: true }, { new: true })
      .populate<{ lesson: LessonDocument }>("lesson");
    if (!Progress) {
      throw ApiError.BadRequest("Прогресс пользователя не найден");
    }
    const NextLesson = await lessonModel.findOne({
      module: Progress.module,
      index: Progress.lesson.index + 1,
    });
    if (!NextLesson) {
      await this.completeModuleProgress(user, Progress.module);
    }
    return new LessonProgressDto(Progress);
  }
}
export default new CourseProgressService();
