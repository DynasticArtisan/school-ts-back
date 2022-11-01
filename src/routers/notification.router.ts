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
notifRouter.delete("/:id", notifController.deleteNotif);

notifRouter.post("/", notifController.createCustomNotif);
notifRouter.post("/many", notifController.createManyCustomNotifs);

notifRouter.post("/template/", notifController.createTemplate);
notifRouter.get("/template/", notifController.getAllTemplates);
notifRouter.put("/template/:id", notifController.updateTemplate);
notifRouter.delete("/template/:id", notifController.deleteTemplate);

export default notifRouter;
