import express from "express";
import courseProgressModel from "../models/courseProgress.model";
import homeworkModel from "../models/homework.model";
import homeworkFilesModel from "../models/homeworkFiles.model";
import lessonProgressModel from "../models/lessonProgress.model";
import moduleProgressModel from "../models/moduleProgress.model";
import UserModel from "../models/user.model";
import authService from "../services/auth.service";
import courseService from "../services/course.service";
import mailService from "../services/mails.service";
import notifTemplateService from "../services/noteTemplates.service.ts";
import userService from "../services/user.service";
const devrouter = express.Router();

devrouter.get("/users", async (req, res) => {
  res.json(await UserModel.find());
});
devrouter.post("/users", async (req, res) => {
  // @ts-ignore
  const { name, surname, email, password } = req.body;
  res.json(await authService.registration(name, surname, email, password));
});
devrouter.delete("/users/:id", async (req, res) => {
  res.json(await userService.deleteUser(req.params.id));
});
devrouter.put("/users/:id/role", async (req, res) => {
  res.json(await userService.updateRole(req.params.id, req.body.role));
});
devrouter.post("/mailtemplate", async (req, res) => {
  // @ts-ignore
  const { type, title, subject, html } = req.body;
  res.json(await mailService.createTemplate(type, title, subject, html));
});
devrouter.get("/mailtemplate", async (req, res) => {
  res.json(await mailService.getTemplates());
});
devrouter.get("/notiftemplate", async (req, res) => {
  res.json(await notifTemplateService.getTemplates());
});
devrouter.delete("/courses/:course", async (req, res) => {
  res.json(await courseService.deleteCourse(req.params.course));
});
devrouter.delete("/courses/:course/users", async (req, res) => {
  await courseProgressModel.deleteMany({ course: req.params.course });
  await moduleProgressModel.deleteMany({ course: req.params.course });
  await lessonProgressModel.deleteMany({ course: req.params.course });
  res.send();
});
devrouter.delete("/students", async (req, res) => {
  await courseProgressModel.deleteMany();
  await moduleProgressModel.deleteMany();
  await lessonProgressModel.deleteMany();
  res.send();
});

devrouter.delete("/homeworks", async (req, res) => {
  await homeworkModel.deleteMany();
  await homeworkFilesModel.deleteMany();
  res.send();
});

export default devrouter;
