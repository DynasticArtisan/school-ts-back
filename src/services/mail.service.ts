import ApiError from "../exceptions/ApiError";
import MailTemplateModel, {
  MailTemplateType,
} from "../models/mailTemplates.model";
import nodemailer from "nodemailer";
import config from "config";
import userService from "./user.service";

class MailService {
  transporter: any = null;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.get("smtpHost"),
      port: config.get("smtpPort"),
      secure: false,
      auth: {
        user: config.get("smtpUser"),
        pass: config.get("smtpPass"),
      },
      from: "Scholl Active",
    });
  }

  async sendCustomMails(templateId: string, users: string[]) {
    const Template = await MailTemplateModel.findOne({
      _id: templateId,
      type: MailTemplateType.custom,
    });
    if (!Template) {
      throw ApiError.BadRequest("Шаблон письма не найден");
    }
    const Users = await userService.getUsersArray(users);
    const MailsData = Users.map((user) => {
      return {
        to: user.email,
        ...Template.prepare({ user }),
      };
    });
    MailsData.forEach(async (mail) => {
      try {
        const res = await this.transporter.sendMail(mail);
        console.log(res);
      } catch (e) {
        console.log(e);
      }
    });
  }

  async sendActivationMail(to: string, activateLink: string) {
    console.log(activateLink);
    const Template = await MailTemplateModel.findOne({
      type: MailTemplateType.activate,
    });
    if (!Template) {
      throw ApiError.BadRequest("Шаблон не найден");
    }
    const { subject, html } = await Template.prepare({});
    await this.transporter.sendMail({
      to,
      subject,
      html: html.replace("#activate-link#", activateLink),
    });
  }
  async sendResetPasswordMail(to: string, passwordResetLink: string) {
    const Template = await MailTemplateModel.findOne({
      type: MailTemplateType.resetpassword,
    });
    if (!Template) {
      throw ApiError.BadRequest("Шаблон не найден");
    }
    const { subject, html } = await Template.prepare({});
    await this.transporter.sendMail({
      to,
      subject,
      html: html.replace("#reset-link#", passwordResetLink),
    });
  }

  async getTemplates() {
    return await MailTemplateModel.find();
  }
  async createTemplate(
    type: MailTemplateType,
    title: string,
    subject: string,
    html: string
  ) {
    const Template = await MailTemplateModel.create({
      type,
      title,
      subject,
      html,
    });
    return Template;
  }
  async updateTemplate(
    templateId: string,
    title: string,
    subject: string,
    html: string
  ) {
    const Template = await MailTemplateModel.findByIdAndUpdate(
      templateId,
      { title, subject, html },
      { new: true }
    );
    if (!Template) {
      throw ApiError.BadRequest("Шаблон письма не найден");
    }
    return Template;
  }
  async deleteTemplate(templateId: string) {
    const Template = await MailTemplateModel.findByIdAndDelete(templateId);
    if (!Template) {
      throw ApiError.BadRequest("Шаблон письма не найден");
    }
    return true;
  }

  async getCustomTemplates() {
    return await MailTemplateModel.find({ type: MailTemplateType.custom });
  }
  async createCustomTemplate(title: string, subject: string, html: string) {
    const Template = await MailTemplateModel.create({
      type: MailTemplateType.custom,
      title,
      subject,
      html,
    });
    return Template;
  }
  async updateCustomTemplate(
    templateId: string,
    title: string,
    subject: string,
    html: string
  ) {
    const Template = await MailTemplateModel.findOneAndUpdate(
      { _id: templateId, type: MailTemplateType.custom },
      { title, subject, html },
      { new: true }
    );
    if (!Template) {
      throw ApiError.BadRequest("Шаблон письма не найден");
    }
    return Template;
  }
  async deleteCustomTemplate(templateId: string) {
    const Template = await MailTemplateModel.findOneAndDelete({
      _id: templateId,
      type: MailTemplateType.custom,
    });
    if (!Template) {
      throw ApiError.BadRequest("Шаблон письма не найден");
    }
    return true;
  }
}

export default new MailService();
