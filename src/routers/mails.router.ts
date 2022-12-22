import express from "express";
import RoleMiddleware from "../middlewares/role.middleware";
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
  RoleMiddleware([UserRole.super, UserRole.admin]),
  MailsController.getTemplates
);

MailsRouter.post(
  "/templates/",
  RoleMiddleware([UserRole.super, UserRole.admin]),
  Validate(CreateTemplateSchema),
  MailsController.createTemplate
);

MailsRouter.put(
  "/templates/:templateId",
  RoleMiddleware([UserRole.super, UserRole.admin]),
  Validate(UpdateTemplateSchema),
  MailsController.updateTemplate
);

MailsRouter.delete(
  "/templates/:templateId",
  RoleMiddleware([UserRole.super, UserRole.admin]),
  Validate(GetTemplateSchema),
  MailsController.deleteTemplate
);

MailsRouter.post(
  "/templates/:templateId/send",
  RoleMiddleware([UserRole.super, UserRole.admin]),
  Validate(CreateMailsSchema),
  MailsController.createMails
);

export default MailsRouter;
