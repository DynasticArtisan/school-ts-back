import ApiError from "src/exceptions/ApiError";
import courseModel from "src/models/courseModel";
import { UserRole } from "src/models/userModel";
import courseMastersService from "./courseMastersService";
import courseProgressService from "./courseProgressService";
import { TokenUser } from "./tokenService";

const CourseDto = require("../dtos/CourseDto");

class CoursesService {
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
      throw new ApiError.BadRequest("Курс не найден");
    }
    return new CourseDto(Course);
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
