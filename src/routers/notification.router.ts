import express from "express";
import CreateAccessMiddleware from "../middlewares/createAccessMiddleware";
import { UserRole } from "../models/user.model";
import Validate from "../middlewares/validate.middleware";
import {
  CreateNoteSchema,
  CreateTemplateSchema,
  GetNoteSchema,
  GetTemplateSchema,
  UpdateTemplateSchema,
} from "../schemas/note.schema";
import NoteController from "../controllers/note.controller";

const NoteRouter = express.Router();

NoteRouter.get(
  "/template/",
  CreateAccessMiddleware([UserRole.super, UserRole.admin]),
  NoteController.getTemplates
);

NoteRouter.post(
  "/template/",
  CreateAccessMiddleware([UserRole.super, UserRole.admin]),
  Validate(CreateTemplateSchema),
  NoteController.createTemplate
);

NoteRouter.put(
  "/template/:templateId",
  CreateAccessMiddleware([UserRole.super, UserRole.admin]),
  Validate(UpdateTemplateSchema),
  NoteController.updateTemplate
);

NoteRouter.delete(
  "/template/:templateId",
  CreateAccessMiddleware([UserRole.super, UserRole.admin]),
  Validate(GetTemplateSchema),
  NoteController.deleteTemplate
);

NoteRouter.post(
  "/template/:templateId/send",
  CreateAccessMiddleware([UserRole.super, UserRole.admin]),
  Validate(CreateNoteSchema),
  NoteController.createNotes
);

NoteRouter.get(
  "/me/check",
  CreateAccessMiddleware([UserRole.user]),
  NoteController.checkNewNotifications
);

NoteRouter.get(
  "/me",
  CreateAccessMiddleware([UserRole.user]),
  NoteController.getUserNotifications
);

NoteRouter.delete(
  "/me/:noteId",
  CreateAccessMiddleware([UserRole.user]),
  Validate(GetNoteSchema),
  NoteController.deleteUserNotification
);

export default NoteRouter;
