import { NextFunction, Request, Response } from "express";
import mailService from "../services/mail.service";

class MailsController {
  async getTemplates(req: Request, res: Response, next: NextFunction) {
    try {
      const Templates = await mailService.getCustomTemplates();
      res.json(Templates);
    } catch (e) {
      next(e);
    }
  }
  async createTemplate(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, subject, html } = req.body;
      const Template = await mailService.createCustomTemplate(
        title,
        subject,
        html
      );
      res.json(Template);
    } catch (e) {
      next(e);
    }
  }
  async updateTemplate(req: Request, res: Response, next: NextFunction) {
    try {
      const { templateId } = req.params;
      const { title, subject, html } = req.body;
      const Template = await mailService.updateCustomTemplate(
        templateId,
        title,
        subject,
        html
      );
      res.json(Template);
    } catch (e) {
      next(e);
    }
  }
  async deleteTemplate(req: Request, res: Response, next: NextFunction) {
    try {
      const { templateId } = req.params;
      await mailService.deleteCustomTemplate(templateId);
      res.json({ message: "Шаблон письма удален" });
    } catch (e) {
      next(e);
    }
  }
  async sendMails(req: Request, res: Response, next: NextFunction) {
    try {
      const { templateId, users } = req.body;
      await mailService.sendCustomMails(templateId, users);
      res.json("Письма отправлены");
    } catch (e) {
      next(e);
    }
  }
}

export default new MailsController();
