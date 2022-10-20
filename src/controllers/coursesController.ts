import { NextFunction, Request, Response } from "express";
import ApiError from "src/exceptions/ApiError";
import { CourseInput } from "src/models/courseModel";
import courseConstructionService from "src/services/courseConstructionService";
import courseMastersService from "src/services/courseMastersService";
import courseProgressService from "src/services/courseProgressService";
import coursesService from "src/services/coursesService";

class CoursesController {
  async createCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { icon, image } = req.files;
      const { title, subtitle, description } = req.body;
      if (!icon || !image) {
        throw ApiError.BadRequest("Изображения не найдены");
      }
      const Course = await courseConstructionService.createCourse({
        title,
        subtitle,
        description,
        image: "images/" + image[0].filename,
        icon: "images/" + image[0].filename,
      });
      res.json(Course);
    } catch (e) {
      next(e);
    }
  }
  async updateCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { course } = req.params;
      const { icon, image } = req.files;
      const { title, subtitle, description } = req.body;
      const courseData: CourseInput = { title, subtitle, description };
      if (icon) {
        courseData.icon = "images/" + icon[0].filename;
      }
      if (image) {
        courseData.image = "images/" + image[0].filename;
      }
      const Course = await courseConstructionService.updateCourse(
        course,
        courseData
      );
      res.json(Course);
    } catch (e) {
      next(e);
    }
  }
  async deleteCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { course } = req.params;
      await courseConstructionService.deleteCourse(course);
      res.json({ message: "Курс удален" });
    } catch (e) {
      next(e);
    }
  }

  async createCourseProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const { course } = req.params;
      const { user, format } = req.body;
      const Progress = await courseProgressService.createCourseProgress(
        user,
        course,
        format
      );
      res.json(Progress);
    } catch (e) {
      next(e);
    }
  }
  async updateProgressAccess(req: Request, res: Response, next: NextFunction) {
    try {
      const { progress } = req.params;
      const { isAvailable } = req.body;
      const Progress = await courseProgressService.updateCourseProgressAccess(
        progress,
        isAvailable
      );
      res.json(Progress);
    } catch (e) {
      next(e);
    }
  }

  async createCourseMaster(req: Request, res: Response, next: NextFunction) {
    try {
      const { course } = req.params;
      const { user } = req.body;
      const Master = await courseMastersService.createMaster(user, course);
      res.json(Master);
    } catch (e) {
      next(e);
    }
  }
  async updateMasterAccess(req: Request, res: Response, next: NextFunction) {
    try {
      const { master } = req.params;
      const { isAvailable } = req.body;
      const Progress = await courseMastersService.updateMasterAccess(
        master,
        isAvailable
      );
      res.json(Progress);
    } catch (e) {
      next(e);
    }
  }

  async getProgressCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const Courses = await coursesService.getCoursesByRoles(req.user);
      res.json(Courses);
    } catch (e) {
      next(e);
    }
  }
  async getHomeworkCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const Courses = await coursesService.getHomeworkCoursesByRoles(req.user);
      res.json(Courses);
    } catch (e) {
      next(e);
    }
  }

  async getCourseModules(req: Request, res: Response, next: NextFunction) {
    try {
      const { course } = req.params;
      const Course = await coursesService.getCourseModulesByRoles(
        course,
        req.user
      );
      res.json(Course);
    } catch (e) {
      next(e);
    }
  }

  async getCourseStudents(req: Request, res: Response, next: NextFunction) {
    try {
      const { course } = req.params;
      const CourseStudents = await coursesService.getCourseStudentsByRoles(
        course,
        req.user
      );
      res.json(CourseStudents);
    } catch (e) {
      next(e);
    }
  }
  async getCourseExercises(req: Request, res: Response, next: NextFunction) {
    try {
      const { course } = req.params;
      const CourseExercises = await coursesService.getCourseExerciseByRoles(
        course,
        req.user
      );
      res.json(CourseExercises);
    } catch (e) {
      next(e);
    }
  }
}

export default new CoursesController();
