import express from "express";
import UserModel from "../models/user.model";
import authService from "../services/auth.service";
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
devrouter.post("/mailtemplate", async (req, res) => {
  // @ts-ignore
  const { type, title, subject, html } = req.body;
  res.json(await mailService.createTemplate(type, title, subject, html));
});
devrouter.get("/mailtemplate", async (req, res) => {
  res.json(await mailService.getTemplates());
});
export default devrouter;
