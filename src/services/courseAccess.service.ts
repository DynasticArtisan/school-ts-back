import ApiError from "../exceptions/ApiError";
import { UserRole } from "../models/user.model";
import courseMastersService from "./courseMasters.service";
import courseProgressService from "./courseProgress.service";
import TokenDto from "../dtos/token.dto";
import courseService from "./course.service";
import userService from "./user.service";
import homeworkService from "./homework.service";

class CourseAccessService {
  async getCoursesByRoles(user: TokenDto) {
    switch (user.role) {
      case UserRole.user:
        return await courseService.getUserProgressCourses(user.id);
      case UserRole.teacher:
      case UserRole.curator:
        return await courseService.getMasterProgressCourses(user.id);
      case UserRole.super:
        return await courseService.getProgressCourses();
      default:
        throw ApiError.Forbidden();
    }
  }
  async getCourseModulesByRoles(course: string, user: TokenDto) {
    switch (user.role) {
      case UserRole.user:
        await courseProgressService.getCourseProgressAccess(user.id, course);
        return await courseService.getUserCourseModules(course, user.id);
      case UserRole.teacher:
      case UserRole.curator:
        await courseMastersService.getCourseMasterAccess(user.id, course);
        return await courseService.getCourseModules(course);
      case UserRole.super: {
        return await courseService.getCourseModules(course);
      }
      default:
        throw ApiError.Forbidden();
    }
  }
  async getModuleLessonsByRoles(module: string, user: TokenDto) {
    switch (user.role) {
      case UserRole.user:
        await courseProgressService.getModuleProgressAccess(user.id, module);
        return await courseService.getUserModuleLessons(module, user.id);
      case UserRole.teacher:
      case UserRole.curator:
        const Module = await courseService.getModuleLessons(module);
        await courseMastersService.getCourseMasterAccess(
          user.id,
          String(Module.course)
        );
        return Module;
      case UserRole.super:
        return await courseService.getModuleLessons(module);
      default:
        throw ApiError.Forbidden();
    }
  }
  async getLessonByRoles(lesson: string, user: TokenDto) {
    switch (user.role) {
      case UserRole.user:
        await courseProgressService.getLessonProgressAccess(user.id, lesson);
        return await courseService.getUserLesson(lesson, user.id);
      case UserRole.teacher:
      case UserRole.curator:
        const MasterLesson = await courseService.getLesson(lesson);
        await courseMastersService.getCourseMasterAccess(
          user.id,
          String(MasterLesson.course)
        );
        return MasterLesson;
      case UserRole.super:
        return await courseService.getLesson(lesson);
      default:
        throw ApiError.Forbidden();
    }
  }

  async getCourseStudentsByRoles(course: string, user: TokenDto) {
    switch (user.role) {
      case UserRole.teacher:
      case UserRole.curator:
        await courseMastersService.getCourseMasterAccess(user.id, course);
        return await courseService.getCourseStudents(course);
      case UserRole.super:
        return await courseService.getCourseStudents(course);
      default:
        throw ApiError.Forbidden();
    }
  }
  async getCourseStudentProfileByRoles(
    course: string,
    user: string,
    { role, id }: TokenDto
  ) {
    switch (role) {
      case UserRole.teacher:
      case UserRole.curator:
        await courseMastersService.getCourseMasterAccess(id, course);
      case UserRole.teacher:
      case UserRole.curator:
      case UserRole.super:
        await courseProgressService.getCourseProgress(user, course);
        const Profile = await userService.getUserProfile(user);
        const Courses = await courseService.getProfileCourses(user);
        return { user: Profile, courses: Courses };
      default:
        throw ApiError.Forbidden();
    }
  }

  async getHomeworkCoursesByRoles(user: TokenDto) {
    switch (user.role) {
      case UserRole.teacher:
      case UserRole.curator:
        return await courseService.getMasterHomeworkCourses(user.id);
      case UserRole.super:
        return await courseService.getCourses();
      default:
        throw ApiError.Forbidden();
    }
  }
  async getCourseExerciseByRoles(course: string, user: TokenDto) {
    switch (user.role) {
      case UserRole.teacher:
      case UserRole.curator:
        await courseMastersService.getCourseMasterAccess(user.id, course);
        return await courseService.getCourseExercises(course);
      case UserRole.super:
        return await courseService.getCourseExercises(course);
      default:
        throw ApiError.Forbidden();
    }
  }
  async getLessonHomeworksByRole(lesson: string, user: TokenDto) {
    switch (user.role) {
      case UserRole.teacher:
      case UserRole.curator:
        const Lesson = await courseService.getLessonHomeworks(lesson);
        await courseMastersService.getCourseMasterAccess(
          user.id,
          String(Lesson.course)
        );
        return Lesson;
      case UserRole.super:
        return await courseService.getLessonHomeworks(lesson);
      default:
        throw ApiError.Forbidden();
    }
  }
  async getHomeworkByRoles(homework: string, user: TokenDto) {
    switch (user.role) {
      case UserRole.teacher:
      case UserRole.curator:
        const Homework = await homeworkService.getHomework(homework);
        await courseMastersService.getCourseMasterAccess(
          user.id,
          String(Homework.course)
        );
        return Homework;
      case UserRole.super:
        return await homeworkService.getHomework(homework);
      default:
        throw ApiError.Forbidden();
    }
  }
  async acceptHomeworkByRoles(homework: string, user: TokenDto) {
    switch (user.role) {
      case UserRole.teacher:
      case UserRole.curator:
        await homeworkService.verifyHomework(homework, user.id);
        const MasterAcceptedHomework = await homeworkService.acceptHomework(
          homework
        );
        return MasterAcceptedHomework;
      case UserRole.super:
        return await homeworkService.acceptHomework(homework);
      default:
        throw ApiError.Forbidden();
    }
  }
  async rejectHomeworkByRoles(homework: string, user: TokenDto) {
    switch (user.role) {
      case UserRole.teacher:
      case UserRole.curator:
        await homeworkService.verifyHomework(homework, user.id);
        const MasterRejectedHomework = await homeworkService.rejectHomework(
          homework
        );
        return MasterRejectedHomework;
      case UserRole.super:
        const RejectedHomework = await homeworkService.rejectHomework(homework);
        return RejectedHomework;
      default:
        throw ApiError.Forbidden();
    }
  }
}

export default new CourseAccessService();
