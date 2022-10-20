import LessonDto from "src/dtos/LessonDto";
import ModuleDto from "src/dtos/ModuleDto";
import ApiError from "src/exceptions/ApiError";
import courseModel from "src/models/courseModel";
import lessonModel from "src/models/lessonModel";
import moduleModel from "src/models/moduleModel";
import { UserRole } from "src/models/userModel";
import courseMastersService from "./courseMastersService";
import courseProgressService from "./courseProgressService";
import { TokenUser } from "./tokenService";

const CourseDto = require("../dtos/CourseDto");

class CoursesService {
  // ---------------------BY ROLES---------------------------------
  async getCoursesByRoles(user: TokenUser) {
    switch (user.role) {
      case UserRole.user:
        const UserCourses = await courseModel.find().populate({
          path: "progress",
          match: { user: user.id },
          populate: ["completedLessonsCount", "totalLessonsCount"],
        });
        return UserCourses.filter((course) => course.progress).map(
          (course) => new CourseDto(course)
        );
      case UserRole.teacher || UserRole.curator:
        const MasterCourses = await courseModel
          .find()
          .populate("totalCompleted")
          .populate("totalInProgress")
          .populate({
            path: "mastering",
            match: { user: user.id },
          })
          .lean();
        return MasterCourses.filter((course) => course.mastering).map(
          (course) => new CourseDto(course)
        );
      case UserRole.super:
        const Courses = await courseModel
          .find()
          .populate("totalCompleted")
          .populate("totalInProgress")
          .lean();
        return Courses.map((course) => new CourseDto(course));
      default:
        throw ApiError.Forbidden();
    }
  }
  async getHomeworkCoursesByRoles(user: TokenUser) {
    switch (user.role) {
      case UserRole.teacher || UserRole.curator:
        const MasterCourses = await courseModel.find().populate({
          path: "mastering",
          match: { user: user.id },
          populate: {
            path: "verifiedHomeworksCount",
            match: { user: user.id },
          },
        });
        return MasterCourses.filter((course) => course.mastering).map(
          (course) => new CourseDto(course)
        );
      case UserRole.super:
        const Courses = await courseModel.find();
        return Courses.map((course) => new CourseDto(course));
      default:
        throw ApiError.Forbidden();
    }
  }

  async getCourseStudentsByRoles(course: string, user: TokenUser) {
    switch (user.role) {
      case UserRole.teacher:
        await courseMastersService.getMaster(user.id, course);
      case UserRole.teacher || UserRole.super:
        const Course = await this.getCourseStudents(course);
        return new CourseDto(Course);
      default:
        throw ApiError.Forbidden();
    }
  }
  async getCourseExerciseByRoles(course: string, user: TokenUser) {
    switch (user.role) {
      case UserRole.teacher || UserRole.curator:
        await courseMastersService.getMaster(user.id, course);
      case UserRole.teacher || UserRole.curator || UserRole.super:
        const Course = await this.getCourseExercises(course);
        return new CourseDto(Course);
      default:
        throw ApiError.Forbidden();
    }
  }
  async getCourseModulesByRoles(course: string, user: TokenUser) {
    switch (user.role) {
      case UserRole.user:
        const progress = await courseProgressService.getCourseProgress(
          user.id,
          course
        );
        const UserCourse = await this.getUserCourseModules(course, user.id);
        return { ...UserCourse, progress };
      case UserRole.teacher || UserRole.curator:
        const Master = await courseMastersService.getMaster(user.id, course);
        const MasterCourse = await this.getCourseModules(course);
        return { ...MasterCourse, mastering: Master };
      case UserRole.super: {
        const Course = await this.getCourseModules(course);
        return Course;
      }
      default:
        throw ApiError.Forbidden();
    }
  }
  async getModuleLessonsByRoles(module: string, user: TokenUser) {
    switch (user.role) {
      case UserRole.user:
        const progress = await courseProgressService.getModuleProgress(
          user.id,
          module
        );
        const UserModule = await this.getUserModuleLessons(module, user.id);
        return { ...UserModule, progress };
      case UserRole.teacher || UserRole.curator:
        const MasterModule = await this.getModuleLessons(module);
        await courseMastersService.getMaster(user.id, MasterModule.course);
        return new ModuleDto(MasterModule);
      case UserRole.super:
        const Module = await this.getModuleLessons(module);
        return new ModuleDto(Module);
      default:
        throw ApiError.Forbidden();
    }
  }
  async getLessonByRoles(lesson: string, user: TokenUser) {
    switch (user.role) {
      case UserRole.user:
        const progress = await courseProgressService.getLessonProgress(
          user.id,
          lesson
        );
        const UserLesson = await this.getUserLesson(lesson, user.id);
        return { ...UserLesson, progress };
      case UserRole.super:
        const MasterLesson = await this.getLesson(lesson);
        await courseMastersService.getMaster(user.id, MasterLesson.course);
        return MasterLesson;
      case UserRole.teacher || UserRole.curator:
        const Lesson = await this.getLesson(lesson);
        return Lesson;
      default:
        throw ApiError.Forbidden();
    }
  }

  // ------------------------------------------------------------

  async getCourseModules(course: string) {
    const Course = await courseModel
      .findById(course)
      .populate("modules")
      .lean();
    if (!Course) {
      throw ApiError.BadRequest("Курс не найден");
    }
    return new CourseDto(Course);
  }
  async getUserCourseModules(course: string, user: string) {
    const Course = await courseModel.findById(course).populate({
      path: "modules",
      populate: {
        path: "progress",
        match: { user },
      },
    });
    if (!Course) {
      throw ApiError.BadRequest("Курс не найден");
    }
    return new CourseDto(Course);
  }
  async getModuleLessons(module: string) {
    const Module = await moduleModel
      .findById(module)
      .populate("lessons")
      .lean();
    if (!Module) {
      throw ApiError.BadRequest("Модуль не найден");
    }
    return new ModuleDto(Module);
  }
  async getUserModuleLessons(module: string, user: string) {
    const Module = await moduleModel.findById(module).populate({
      path: "lessons",
      populate: {
        path: "progress",
        match: { user },
      },
    });
    if (!Module) {
      throw ApiError.BadRequest("Курс не найден");
    }
    return new ModuleDto(Module);
  }
  async getLesson(lesson: string) {
    const Lesson = await lessonModel.findById(lesson);
    if (!Lesson) {
      throw ApiError.BadRequest("Урок не найден");
    }
    return new LessonDto(Lesson);
  }
  async getUserLesson(lesson: string, user: string) {
    const Lesson = await lessonModel.findById(lesson);
    if (!Lesson) {
      throw ApiError.BadRequest("Урок не найден");
    }
    return Lesson;
  }
  async getCourseStudents(course: string) {
    const Course = await courseModel
      .findById(course)
      .populate({
        path: "students",
        populate: [
          {
            path: "user",
            select: "name surname",
          },
          {
            path: "lastLesson",
            populate: "lesson module",
          },
        ],
      })
      .lean();
    if (!Course) {
      throw ApiError.BadRequest("Курс не найден");
    }
    return new CourseDto(Course);
  }
  async getCourseExercises(course: string) {
    const Course = await courseModel.findById(course).populate({
      path: "exercises",
    });
  }

  // #####################################

  async getUserCourses(user) {
    const Courses = await courseModel.find().populate({
      path: "progress",
      match: { user },
      populate: {
        path: "lastLesson",
        populate: "lesson module",
      },
    });
    return Courses.map((course) => new CourseDto(course));
  }
  async getMasterCourses(user) {
    const Courses = await courseModel.find().populate({
      path: "mastering",
      match: { user },
    });
    return Courses.map((course) => new CourseDto(course));
  }

  async getCourse(id) {
    const Course = await courseModel.findById(id);
    if (!Course) {
      throw ApiError.BadRequest("Курс не найден");
    }
    return new CourseDto(Course);
  }

  async dropAllCourses() {
    await courseModel.deleteMany();
  }
}

export default new CoursesService();
