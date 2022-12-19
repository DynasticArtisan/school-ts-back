import ApiError from "../exceptions/ApiError";
import courseModel from "../models/course.model";
import courseProgressModel, {
  CourseProgressFormat,
} from "../models/courseProgress.model";
import { HomeworkDocument, HomeworkStatus } from "../models/homework.model";
import lessonModel, { LessonDocument } from "../models/lesson.model";
import lessonProgressModel from "../models/lessonProgress.model";
import moduleModel, { ModuleDocument } from "../models/module.model";
import moduleProgressModel from "../models/moduleProgress.model";
import userModel, { UserRole } from "../models/user.model";

import courseService from "./course.service";
import notificationService from "./notes.service";

class CourseProgressService {
  async createCourseProgress(user: string, course: string, format: string) {
    if (!Object.values<string>(CourseProgressFormat).includes(format)) {
      throw ApiError.BadRequest("Неверный формат");
    }
    const PrevProgress = await courseProgressModel.findOne({ user, course });
    if (PrevProgress) {
      throw ApiError.BadRequest("Курс уже доступен пользователю");
    }
    const User = await userModel.findOne({
      _id: user,
      role: UserRole.user,
      isActivated: true,
    });
    if (!User) {
      throw ApiError.BadRequest("Ползователь не найден");
    }
    const Course = await courseModel
      .findById(course)
      .populate<{ firstModule: ModuleDocument }>("firstModule");
    if (!Course) {
      throw ApiError.BadRequest("Курс не найден");
    }
    const Progress = await courseProgressModel.create({
      user,
      course,
      format,
      endAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    });
    if (Course.firstModule) {
      await this.createModuleProgress(user, String(Course.firstModule._id));
    }
    return Progress;
  }

  async getCourseProgressById(progressId: string) {
    const Progress = await courseProgressModel.findById(progressId);
    if (!Progress) {
      throw ApiError.BadRequest("Прогресс пользователя не найден");
    }
    return Progress;
  }
  async getCourseProgress(user: string, course: string) {
    const Progress = await courseProgressModel.findOne({
      user,
      course,
    });
    if (!Progress) {
      throw ApiError.BadRequest("Прогресс пользователя не найден");
    }
    return Progress;
  }

  async getCourseProgressAccess(user: string, course: string) {
    const Progress = await courseProgressModel.findOne({
      user,
      course,
      isAvailable: true,
    });
    if (!Progress) {
      throw ApiError.Forbidden();
    }
    return Progress;
  }
  async updateCourseProgressAccess(
    user: string,
    course: string,
    isAvailable: boolean
  ) {
    const Progress = await courseProgressModel.findOneAndUpdate(
      { user, course },
      { isAvailable },
      {
        new: true,
      }
    );
    if (!Progress) {
      throw ApiError.BadRequest("Прогресс пользователя не найден");
    }
    const Course = await courseService.getCourse(Progress.course);
    try {
      if (isAvailable) {
        await notificationService.createCourseUnlockNote(
          String(Progress.user),
          Course
        );
      } else {
        await notificationService.createCourseLockNote(
          String(Progress.user),
          Course
        );
      }
    } catch (e) {
      console.log(e);
    }
    return Progress;
  }
  async updateCourseProgressAccessById(
    progressId: string,
    isAvailable: boolean
  ) {
    const Progress = await courseProgressModel.findByIdAndUpdate(
      progressId,
      { isAvailable },
      {
        new: true,
      }
    );
    if (!Progress) {
      throw ApiError.BadRequest("Прогресс пользователя не найден");
    }

    try {
      const Course = await courseService.getCourse(Progress.course);
      if (isAvailable) {
        await notificationService.createCourseUnlockNote(
          String(Progress.user),
          Course
        );
      } else {
        await notificationService.createCourseLockNote(
          String(Progress.user),
          Course
        );
      }
    } catch (e) {
      console.log(e);
    }

    return Progress;
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
    return Progress;
  }

  async createModuleProgress(user: string, module: string) {
    const PrevProgress = await moduleProgressModel.findOne({ user, module });
    if (PrevProgress) {
      throw ApiError.BadRequest("Прогресс пользователя уже существует");
    }
    const Module = await moduleModel
      .findById(module)
      .populate<{ firstLesson: LessonDocument }>("firstLesson");
    if (!Module) {
      throw ApiError.BadRequest("Модуль не найден");
    }
    const Progress = await moduleProgressModel.create({
      user,
      module,
      course: Module.course,
    });
    if (Module.firstLesson) {
      await this.createLessonProgress(user, String(Module.firstLesson._id));
    }
    return Progress;
  }
  async getModuleProgress(user: string, module: string) {
    const Progress = await moduleProgressModel.findOne({
      user,
      module,
    });
    if (!Progress) {
      throw ApiError.BadRequest("Прогресс не найден");
    }
    return Progress;
  }
  async getModuleProgressAccess(user: string, module: string) {
    const ModuleProgress = await moduleProgressModel.findOne({
      user,
      module,
      isAvailable: true,
    });
    if (!ModuleProgress) {
      throw ApiError.Forbidden();
    }
    await this.getCourseProgressAccess(user, String(ModuleProgress.course));
    return ModuleProgress;
  }
  async completeModuleProgress(user: string, module: string) {
    const Progress = await moduleProgressModel
      .findOneAndUpdate({ user, module }, { isCompleted: true }, { new: true })
      .populate<{ module: ModuleDocument }>("module");

    if (!Progress) {
      throw ApiError.BadRequest("Прогресс пользователя не найден");
    }
    console.log(Progress.module.title);
    const NextModule = await moduleModel.findOne({
      course: Progress.course,
      index: Number(Progress.module.index + 1),
    });
    if (NextModule) {
      await this.createModuleProgress(user, String(NextModule._id));
    } else {
      await this.completeCourseProgress(user, String(Progress.course));
    }
    return Progress;
  }

  async createLessonProgress(user: string, lesson: string) {
    const PrevProgress = await lessonProgressModel.findOne({ user, lesson });
    if (PrevProgress) {
      throw ApiError.BadRequest("Прогресс пользователя уже существует");
    }
    const Lesson = await lessonModel.findById(lesson);
    if (!Lesson) {
      throw ApiError.BadRequest("Урок не найден");
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
    const Progress = await lessonProgressModel.findOne({
      user,
      lesson,
    });
    if (!Progress) {
      throw ApiError.BadRequest("Прогресс не найден");
    }
    return Progress;
  }
  async getLessonProgressAccess(user: string, lesson: string) {
    const LessonProgress = await lessonProgressModel.findOne({
      lesson,
      user,
      isAvailable: true,
    });
    if (!LessonProgress) {
      throw ApiError.Forbidden();
    }
    await this.getModuleProgressAccess(user, String(LessonProgress.module));
    return LessonProgress;
  }
  async completeLessonProgress(user: string, lesson: string) {
    const Progress = await lessonProgressModel
      .findOne({ user, lesson, isAvailable: true })
      .populate<{ lesson: LessonDocument; homework: HomeworkDocument }>([
        {
          path: "lesson",
        },
        {
          path: "homework",
          match: { status: HomeworkStatus.accept },
        },
      ]);
    if (!Progress) {
      throw ApiError.BadRequest("Прогресс пользователя не найден");
    }
    if (Progress.lesson.withExercise && !Progress.homework) {
      throw ApiError.BadRequest("Домашнее задание не выполнено");
    }
    await this.getModuleProgressAccess(user, String(Progress.module));
    Progress.isCompleted = true;
    await Progress.save();
    const NextLesson = await lessonModel.findOne({
      module: Progress.module,
      index: Number(Progress.lesson.index + 1),
    });
    if (NextLesson) {
      await this.createLessonProgress(user, String(NextLesson._id));
    } else {
      await this.completeModuleProgress(user, String(Progress.module));
    }
    return Progress;
  }
}
export default new CourseProgressService();
