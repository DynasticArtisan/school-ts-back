import ApiError from "src/exceptions/ApiError";
import courseProgressModel, {
  CourseProgressFormat,
} from "src/models/courseProgressModel";
import lessonModel, { LessonDocument } from "src/models/lessonModel";
import lessonProgressModel from "src/models/lessonProgressModel";
import moduleModel, { ModuleDocument } from "src/models/moduleModel";
import moduleProgressModel from "src/models/moduleProgressModel";
import userModel from "src/models/userModel";
import courseDataService from "./courseDataService";
import notifsService from "./notifications/notifsService";

const CourseProgressDto = require("../dtos/CourseProgressDto");
const ModuleProgressDto = require("../dtos/ModuleProgressDto");
const LessonProgressDto = require("../dtos/LessonProgressDto");

class CourseProgressService {
  async createCourseProgress(user: string, course: string, format: string) {
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
  async getCourseProgress(user: string, course: string) {
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
  async updateCourseProgressAccess(progress: string, isAvailable: boolean) {
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
    const Course = await courseDataService.getCourse(Progress.course);
    if (isAvailable) {
      await notifsService.createCourseUnlockNotif(Progress.user, Course);
    } else {
      await notifsService.createCourseLockNotif(Progress.user, Course);
    }
    return new CourseProgressDto(Progress);
  }
  async completeCourseProgress(user: string, course: string) {
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

  async createModuleProgress(user: string, module: string) {
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
  async getModuleProgress(user: string, module: string) {
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
  async completeModuleProgress(user: string, module: string) {
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

  async createLessonProgress(user: string, lesson: string) {
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
  async getLessonProgress(user: string, lesson: string) {
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
  async completeLessonProgress(user: string, lesson: string) {
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

  // ##################################################

  async getCourseStudents(course: string) {
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
}
export default new CourseProgressService();
