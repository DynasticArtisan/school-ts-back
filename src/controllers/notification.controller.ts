import { Request, Response, NextFunction } from "express";
import notificationService from "../services/notification.service";
import notifTemplateService from "../services/notifTemplate.service.ts";

class NotifController {
  async createTemplate(req: Request, res: Response, next: NextFunction) {
    try {
      const { type, title, image, icon, body } = req.body;
      const Template = await notifTemplateService.createTemplate({
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
      const Templates = await notifTemplateService.getAllTemplates();
      res.json(Templates);
    } catch (e) {
      next(e);
    }
  }

  async updateTemplate(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { type, title, image, icon, body } = req.body;
      const Template = await notifTemplateService.updateTemplate(id, {
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
  async deleteTemplate(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const Template = await notifTemplateService.deleteTemplate(id);
      res.json(Template);
    } catch (e) {
      next(e);
    }
  }

  async getAllNotifs(req: Request, res: Response, next: NextFunction) {
    try {
      const Notifs = await notificationService.getAllNotifs();
      res.json(Notifs);
    } catch (e) {
      next(e);
    }
  }

  async checkUserNotifs(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.user;
      const Count = await notificationService.checkNewUserNotifs(id);
      res.json(Count);
    } catch (e) {
      next(e);
    }
  }

  async getUserNotifs(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.user;
      const Notifs = await notificationService.getUserNotifs(id);
      res.json(Notifs);
    } catch (e) {
      next(e);
    }
  }
  async deleteNotif(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const Notif = await notificationService.deleteNotif(id);
      res.json(Notif);
    } catch (e) {
      next(e);
    }
  }

  async createCustomNotif(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, user } = req.body;
      const Notif = await notificationService.createCustomNotif(id, user);
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
      const Notif = await notificationService.createManyCustomNotif(id, users);
      res.json(Notif);
    } catch (e) {
      next(e);
    }
  }
}

export default new NotifController();
