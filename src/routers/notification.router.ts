import express from "express";
import notifController from "../controllers/notification.controller";
import AuthMiddleware from "../middlewares/authMiddleware";

const notifRouter = express.Router();

notifRouter.post("/", notifController.createCustomNotif);
notifRouter.post("/many", notifController.createManyCustomNotifs);
notifRouter.get("/", notifController.getAllNotifs);
notifRouter.get("/new", AuthMiddleware, notifController.checkUserNotifs);
notifRouter.get("/me", AuthMiddleware, notifController.getUserNotifs);
notifRouter.delete("/:id", notifController.deleteNotif);

notifRouter.post("/template/", notifController.createTemplate);
notifRouter.get("/template/", notifController.getAllTemplates);
notifRouter.put("/template/:id", notifController.updateTemplate);
notifRouter.delete("/template/:id", notifController.deleteTemplate);

export default notifRouter;
