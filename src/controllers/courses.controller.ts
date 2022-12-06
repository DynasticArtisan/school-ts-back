import { NextFunction, Request, Response } from "express";
import {
  CreateCourseType,
  CreateStudentType,
  CreateTeacherType,
  GetCourseType,
  GetStudentType,
  UpdateAccessType,
  UpdateCourseType,
} from "../schemas/course.schema";
import courseService from "../services/course.service";
import courseDataService from "../services/courseAccess.service";
import courseProgressService from "../services/courseProgress.service";
import courseMastersService from "../services/courseMasters.service";
import ApiError from "../exceptions/ApiError";

class CoursesController {
  async getCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const Courses = await courseDataService.getCoursesByRoles(req.user);
      res.json(Courses);
    } catch (e) {
      next(e);
    }
  }
  async createCourse(
    req: Request<{}, {}, CreateCourseType["body"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { title, subtitle, description } = req.body;
      let image, icon;
      if (req.files && !Array.isArray(req.files)) {
        if (req.files["image"]) {
          image = req.files["image"][0].path;
        }
        if (req.files["icon"]) {
          icon = req.files["icon"][0].path;
        }
      }
      if (!image || !icon) {
        throw ApiError.BadRequest("Изображения не загружены");
      }
      const Course = await courseService.createCourse(
        title,
        subtitle,
        description,
        image,
        icon
      );
      res.json(Course);
    } catch (e) {
      next(e);
    }
  }
  async updateCourse(
    req: Request<UpdateCourseType["params"], {}, UpdateCourseType["body"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId } = req.params;
      const { title, subtitle, description } = req.body;
      let image, icon;
      if (req.files && !Array.isArray(req.files)) {
        if (req.files["image"]) {
          image = req.files["image"][0].path;
        }
        if (req.files["icon"]) {
          icon = req.files["icon"][0].path;
        }
      }
      const Course = await courseService.updateCourse(
        courseId,
        title,
        subtitle,
        description,
        image,
        icon
      );
      res.json(Course);
    } catch (e) {
      next(e);
    }
  }
  async deleteCourse(
    req: Request<GetCourseType["params"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId } = req.params;
      await courseService.deleteCourse(courseId);
      res.json({ message: "Курс удален" });
    } catch (e) {
      next(e);
    }
  }
  async getModules(
    req: Request<GetCourseType["params"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId } = req.params;
      const Course = await courseDataService.getCourseModulesByRoles(
        courseId,
        req.user
      );
      res.json(Course);
    } catch (e) {
      next(e);
    }
  }
  async getStudents(
    req: Request<GetCourseType["params"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId } = req.params;
      const CourseStudents = await courseDataService.getCourseStudentsByRoles(
        courseId,
        req.user
      );
      res.json(CourseStudents);
    } catch (e) {
      next(e);
    }
  }
  async createStudent(
    req: Request<CreateStudentType["params"], {}, CreateStudentType["body"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId } = req.params;
      const { userId, format } = req.body;
      const Student = await courseProgressService.createCourseProgress(
        userId,
        courseId,
        format
      );
      res.json(Student);
    } catch (e) {
      next(e);
    }
  }
  async getStudentProfile(
    req: Request<GetStudentType["params"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId, userId } = req.params;
      const Profile = await courseDataService.getCourseStudentProfileByRoles(
        courseId,
        userId,
        req.user
      );
      res.json(Profile);
    } catch (e) {
      next(e);
    }
  }
  async updateStudentAccess(
    req: Request<UpdateAccessType["params"], {}, UpdateAccessType["body"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId, userId } = req.params;
      const { isAvailable } = req.body;
      const Progress = await courseProgressService.updateCourseProgressAccess(
        userId,
        courseId,
        isAvailable
      );
      res.json(Progress);
    } catch (e) {
      next(e);
    }
  }

  async createMaster(
    req: Request<CreateTeacherType["params"], {}, CreateTeacherType["body"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId } = req.params;
      const { userId } = req.body;
      const Master = await courseMastersService.createCourseMaster(
        userId,
        courseId
      );
      res.json(Master);
    } catch (e) {
      next(e);
    }
  }
  async updateMasterAccess(
    req: Request<UpdateAccessType["params"], {}, UpdateAccessType["body"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId, userId } = req.params;
      const { isAvailable } = req.body;
      const Progress = await courseMastersService.updateCourseMasterAccess(
        userId,
        courseId,
        isAvailable
      );
      res.json(Progress);
    } catch (e) {
      next(e);
    }
  }
}

export default new CoursesController();
