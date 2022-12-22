import express from "express";
import RoleMiddleware from "../middlewares/role.middleware";
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
  RoleMiddleware([UserRole.super, UserRole.admin]),
  NoteController.getTemplates
);

NoteRouter.post(
  "/template/",
  RoleMiddleware([UserRole.super, UserRole.admin]),
  Validate(CreateTemplateSchema),
  NoteController.createTemplate
);

NoteRouter.put(
  "/template/:templateId",
  RoleMiddleware([UserRole.super, UserRole.admin]),
  Validate(UpdateTemplateSchema),
  NoteController.updateTemplate
);

NoteRouter.delete(
  "/template/:templateId",
  RoleMiddleware([UserRole.super, UserRole.admin]),
  Validate(GetTemplateSchema),
  NoteController.deleteTemplate
);

NoteRouter.post(
  "/template/:templateId/send",
  RoleMiddleware([UserRole.super, UserRole.admin]),
  Validate(CreateNoteSchema),
  NoteController.createNotes
);

NoteRouter.get(
  "/me/check",
  RoleMiddleware([UserRole.user]),
  NoteController.checkNewNotifications
);

NoteRouter.get(
  "/me",
  RoleMiddleware([UserRole.user]),
  NoteController.getUserNotifications
);

NoteRouter.delete(
  "/me/:noteId",
  RoleMiddleware([UserRole.user]),
  Validate(GetNoteSchema),
  NoteController.deleteUserNote
);

export default NoteRouter;
