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
      const { templateId } = req.params;
      const { title, image, icon, body } = req.body;
      const Template = await notifTemplateService.updateTemplate(templateId, {
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
      const { templateId } = req.params;
      await notifTemplateService.deleteTemplate(templateId);
      res.json({ message: "Шаблон уведомления удален" });
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
      const { template, users } = req.body;
      const Notif = await notificationService.createManyCustomNotif(
        template,
        users
      );
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
  async deleteUserNotification(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { notification } = req.params;
      await notificationService.deleteUserNotif(notification, req.user.id);
      res.json({ message: "Уведомление удалено" });
    } catch (e) {
      next(e);
    }
  }
}

export default new NotifController();
