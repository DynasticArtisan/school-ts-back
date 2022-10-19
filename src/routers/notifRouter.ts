import express from "express";
import notifController from "src/controllers/notifController";
import AuthMiddleware from "src/middlewares/authMiddleware";

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

notifRouter.post("/hw-wait", notifController.createHWWaitNotif);
notifRouter.post("/course-lock", notifController.createCourseLockNotif);
notifRouter.post("/course-unlock", notifController.createCourseUnlockNotif);
notifRouter.post("/new-user", notifController.createNewUserNotif);

export default notifRouter;
