import ApiError from "../exceptions/ApiError";
import MailTemplateModel, {
  MailTemplateType,
} from "../models/mailTemplates.model";
import nodemailer from "nodemailer";
import config from "config";

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
  async getTemplates() {
    return await MailTemplateModel.find();
  }
}

export default new MailService();
