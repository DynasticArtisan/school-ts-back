import express from "express";
import mailsController from "../controllers/mails.controller";

const MailsRouter = express.Router();
MailsRouter.post("/", mailsController.sendMails);
MailsRouter.get("/templates/", mailsController.getTemplates);
MailsRouter.post("/templates/", mailsController.createTemplate);
MailsRouter.put("/templates/:templateId", mailsController.updateTemplate);
MailsRouter.delete("/templates/:templateId", mailsController.deleteTemplate);

export default MailsRouter;
