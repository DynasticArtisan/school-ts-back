import { Request, Response, NextFunction } from "express";
import {
  CreateNoteType,
  CreateTemplateType,
  GetNoteType,
  GetTemplateType,
  UpdateTemplateType,
} from "../schemas/note.schema";
import NoteService from "../services/notification.service";
import TemplateService from "../services/notifTemplate.service.ts";

class NotifController {
  async getTemplates(req: Request, res: Response, next: NextFunction) {
    try {
      const Templates = await TemplateService.getCustomTemplates();
      res.json(Templates);
    } catch (e) {
      next(e);
    }
  }

  async createTemplate(
    req: Request<{}, {}, CreateTemplateType["body"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { title, image, icon, body } = req.body;
      const Template = await TemplateService.createTemplate({
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

  async updateTemplate(
    req: Request<UpdateTemplateType["params"], {}, UpdateTemplateType["body"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { templateId } = req.params;
      const { title, image, icon, body } = req.body;
      const Template = await TemplateService.updateTemplate(templateId, {
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
    req: Request<GetTemplateType["params"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { templateId } = req.params;
      await TemplateService.deleteTemplate(templateId);
      res.json({ message: "Шаблон уведомления удален" });
    } catch (e) {
      next(e);
    }
  }

  async createNotes(
    req: Request<CreateNoteType["params"], {}, CreateNoteType["body"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { templateId } = req.params;
      const { users } = req.body;
      const Notif = await NoteService.createManyCustomNotif(templateId, users);
      res.json(Notif);
    } catch (e) {
      next(e);
    }
  }

  async checkNewNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const Count = await NoteService.checkNewNotifs(req.user.id);
      res.json(Count);
    } catch (e) {
      next(e);
    }
  }

  async getUserNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const Notifs = await NoteService.getUserNotifs(req.user.id);
      res.json(Notifs);
    } catch (e) {
      next(e);
    }
  }

  async deleteUserNotification(
    req: Request<GetNoteType["params"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { noteId } = req.params;
      await NoteService.deleteUserNotif(noteId, req.user.id);
      res.json({ message: "Уведомление удалено" });
    } catch (e) {
      next(e);
    }
  }
}

export default new NotifController();
