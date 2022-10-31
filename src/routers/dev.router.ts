import express from "express";
import UserModel from "../models/user.model";
import authService from "../services/auth.service";
import courseService from "../services/course.service";
import mailService from "../services/mail.service";
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

devrouter.delete("/courses/:course", async (req, res) => {
  res.json(await courseService.deleteCourse(req.params.course));
});
export default devrouter;
