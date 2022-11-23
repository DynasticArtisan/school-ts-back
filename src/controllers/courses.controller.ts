import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import ApiError from "../exceptions/ApiError";
import { CourseInput } from "../models/course.model";
import courseDataService from "../services/courseAccess.service";
import courseService from "../services/course.service";
import courseProgressService from "../services/courseProgress.service";
import courseMastersService from "../services/courseMasters.service";
import {
  CreateCourseType,
  CreateStudentType,
  CreateTeacherType,
  GetCourseType,
  GetStudentType,
  UpdateAccessType,
  UpdateCourseType,
} from "../schemas/course.schema";

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
      if (!req.files || Array.isArray(req.files)) {
        return next(ApiError.BadRequest("Изображения не найдены"));
      }
      const image = req.files["image"][0];
      const icon = req.files["icon"][0];
      if (!image || !icon) {
        return next(ApiError.BadRequest("Изображения не найдены"));
      }
      const { title, subtitle, description } = req.body;
      const Course = await courseService.createCourse({
        title,
        subtitle,
        description,
        image: "images/" + image.filename,
        icon: "images/" + icon.filename,
      });
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
      if (!req.files || Array.isArray(req.files)) {
        return next(ApiError.BadRequest("Изображения не найдены"));
      }
      const image = req.files["image"];
      const icon = req.files["icon"];
      const { courseId } = req.params;
      const { title, subtitle, description } = req.body;
      const courseData: CourseInput = { title, subtitle, description };
      if (icon) {
        courseData.icon = "images/" + icon[0].filename;
      }
      if (image) {
        courseData.image = "images/" + image[0].filename;
      }
      const Course = await courseService.updateCourse(courseId, courseData);
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
    req: Request<CreateTeacherType["params"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId } = req.params;
      const { userId } = req.params;
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
