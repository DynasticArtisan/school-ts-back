import { NextFunction, Request, Response } from "express";
import {
  CreateMailsType,
  CreateTemplateType,
  GetTemplateType,
  UpdateTemplateType,
} from "../schemas/mail.schema";
import MailService from "../services/mails.service";
import MailTemplatesService from "../services/mailTemplates.service";

class MailsController {
  async getTemplates(req: Request, res: Response, next: NextFunction) {
    try {
      const Templates = await MailTemplatesService.getCustomTemplates();
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
      const { title, subject, html } = req.body;
      const Template = await MailTemplatesService.createCustomTemplate(
        title,
        subject,
        html
      );
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
      const { title, subject, html } = req.body;
      const Template = await MailTemplatesService.updateCustomTemplate(
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

  async deleteTemplate(
    req: Request<GetTemplateType["params"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { templateId } = req.params;
      await MailTemplatesService.deleteCustomTemplate(templateId);
      res.json({ message: "Шаблон письма удален" });
    } catch (e) {
      next(e);
    }
  }

  async createMails(
    req: Request<CreateMailsType["params"], {}, CreateMailsType["body"]>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { templateId } = req.params;
      const { users } = req.body;
      await MailService.createCustomMails(templateId, users);
      res.json("Письма отправлены");
    } catch (e) {
      next(e);
    }
  }
}

export default new MailsController();
