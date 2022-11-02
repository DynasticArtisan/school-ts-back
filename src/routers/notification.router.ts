import express from "express";
import notifController from "../controllers/notification.controller";
import AuthMiddleware from "../middlewares/auth.middleware";

const notifRouter = express.Router();
notifRouter.get(
  "/me/check",
  AuthMiddleware,
  notifController.checkNewNotifications
);
notifRouter.get("/me", AuthMiddleware, notifController.getUserNotifications);
notifRouter.delete(
  "/me/:notification",
  AuthMiddleware,
  notifController.deleteUserNotification
);

notifRouter.post("/", notifController.createCustomNotif);
notifRouter.post("/many", notifController.createManyCustomNotifs);
notifRouter.delete("/:id", notifController.deleteNotif);

notifRouter.post("/template/", notifController.createTemplate);
notifRouter.get("/template/", notifController.getAllTemplates);
notifRouter.put("/template/:templateId", notifController.updateTemplate);
notifRouter.delete("/template/:templateId", notifController.deleteTemplate);

export default notifRouter;
