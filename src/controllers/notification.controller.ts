import { Request, Response, NextFunction } from "express";
import notificationService from "../services/notification.service";
import notifTemplateService from "../services/notifTemplate.service.ts";

class NotifController {
  async createTemplate(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, image, icon, body } = req.body;
      const Template = await notifTemplateService.createTemplate({
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
  async deleteNotif(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const Notif = await notificationService.deleteNotif(id);
      res.json(Notif);
    } catch (e) {
      next(e);
    }
  }

  async checkNewNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const Count = await notificationService.checkNewNotifs(req.user.id);
      res.json(Count);
    } catch (e) {
      next(e);
    }
  }
  async getUserNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const Notifs = await notificationService.getUserNotifs(req.user.id);
      res.json(Notifs);
    } catch (e) {
      next(e);
    }
  }
}

export default new NotifController();
