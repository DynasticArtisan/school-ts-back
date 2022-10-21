import { Request, Response, NextFunction } from "express";
import { ObjectId } from "mongoose";
import ApiError from "src/exceptions/ApiError";
import { ITemplate } from "src/models/notifications/templatesModel";
import courseDataService from "src/services/courseDataService";
import lessonsService from "src/services/lessonsService";
import notifsService from "src/services/notifications/notifsService";
import templateService from "src/services/notifications/templateService";
import { HomeworkStatus } from "src/utils/statuses";

class NotifController {
  async createTemplate(
    req: Request<{}, {}, ITemplate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { type, title, image, icon, body } = req.body;
      const Template = await templateService.createTemplate({
        title,
        image,
        icon,
        body,
        type,
      });
      res.json(Template);
    } catch (e) {
      next(e);
    }
  }

  async getAllTemplates(req: Request, res: Response, next: NextFunction) {
    try {
      const Templates = await templateService.getAllTemplates();
      res.json(Templates);
    } catch (e) {
      next(e);
    }
  }
  async updateTemplate(
    req: Request<{ id: ObjectId }, {}, ITemplate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const { type, title, image, icon, body } = req.body;
      const Template = await templateService.updateTemplate(id, {
        type,
        title,
        image,
        icon,
        body,
      });
      res.json(Template);
    } catch (e) {
      next(e);
    }
  }
  async deleteTemplate(
    req: Request<{ id: ObjectId }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const Template = await templateService.deleteTemplate(id);
      res.json(Template);
    } catch (e) {
      next(e);
    }
  }

  async getAllNotifs(req: Request, res: Response, next: NextFunction) {
    try {
      const Notifs = await notifsService.getAllNotifs();
      res.json(Notifs);
    } catch (e) {
      next(e);
    }
  }

  async checkUserNotifs(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.user;
      const Count = await notifsService.checkNewUserNotifs(id);
      res.json(Count);
    } catch (e) {
      next(e);
    }
  }

  async getUserNotifs(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.user;
      const Notifs = await notifsService.getUserNotifs(id);
      res.json(Notifs);
    } catch (e) {
      next(e);
    }
  }
  async deleteNotif(
    req: Request<{ id: ObjectId }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const Notif = await notifsService.deleteNotif(id);
      res.json(Notif);
    } catch (e) {
      next(e);
    }
  }

  async createCustomNotif(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, user } = req.body;
      const Notif = await notifsService.createCustomNotif(id, user);
      res.json(Notif);
    } catch (e) {
      next(e);
    }
  }
  async createManyCustomNotifs(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id, users } = req.body;
      const Notif = await notifsService.createManyCustomNotif(id, users);
      res.json(Notif);
    } catch (e) {
      next(e);
    }
  }
  async createHWWaitNotif(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, lesson } = req.body;
      const Lesson = await lessonsService.getLesson(lesson);
      if (!Lesson) {
        throw ApiError.BadRequest("Урок не найден");
      }
      const Notif = await notifsService.createHomeworkNotif(
        user,
        Lesson,
        HomeworkStatus.wait
      );
      res.json(Notif);
    } catch (e) {
      next(e);
    }
  }
  async createCourseLockNotif(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, course } = req.body;
      const Course = await courseDataService.getCourse(course);
      if (!Course) {
        throw ApiError.BadRequest("Курс не найден");
      }
      const Notif = await notifsService.createCourseLockNotif(user, Course);
      res.json(Notif);
    } catch (e) {
      next(e);
    }
  }
  async createCourseUnlockNotif(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { user, course } = req.body;
      const Course = await courseDataService.getCourse(course);
      if (!Course) {
        throw ApiError.BadRequest("Курс не найден");
      }
      const Notif = await notifsService.createCourseUnlockNotif(user, Course);
      res.json(Notif);
    } catch (e) {
      next(e);
    }
  }

  async createNewUserNotif(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, name } = req.body;
      const Notifs = await notifsService.createNewUserNotifs({ id, name });
      res.json(Notifs);
    } catch (e) {
      next(e);
    }
  }
}

export default new NotifController();
