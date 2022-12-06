import express from "express";
import CreateAccessMiddleware from "../middlewares/createAccessMiddleware";
import { UserRole } from "../models/user.model";
import Validate from "../middlewares/validate.middleware";
import {
  CreateMailsSchema,
  CreateTemplateSchema,
  GetTemplateSchema,
  UpdateTemplateSchema,
} from "../schemas/mail.schema";
import MailsController from "../controllers/mails.controller";

const MailsRouter = express.Router();

MailsRouter.get(
  "/templates/",
  CreateAccessMiddleware([UserRole.super, UserRole.admin]),
  MailsController.getTemplates
);

MailsRouter.post(
  "/templates/",
  CreateAccessMiddleware([UserRole.super, UserRole.admin]),
  Validate(CreateTemplateSchema),
  MailsController.createTemplate
);

MailsRouter.put(
  "/templates/:templateId",
  CreateAccessMiddleware([UserRole.super, UserRole.admin]),
  Validate(UpdateTemplateSchema),
  MailsController.updateTemplate
);

MailsRouter.delete(
  "/templates/:templateId",
  CreateAccessMiddleware([UserRole.super, UserRole.admin]),
  Validate(GetTemplateSchema),
  MailsController.deleteTemplate
);

MailsRouter.post(
  "/templates/:templateId/send",
  CreateAccessMiddleware([UserRole.super, UserRole.admin]),
  Validate(CreateMailsSchema),
  MailsController.createMails
);

export default MailsRouter;
