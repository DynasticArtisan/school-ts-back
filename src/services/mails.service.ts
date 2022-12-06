import config from "config";
import nodemailer from "nodemailer";
import userService from "./user.service";
import mailTemplatesService from "./mailTemplates.service";
import { MailTypes } from "../models/mailTemplates.model";

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

  async createCustomMails(templateId: string, users: string[]) {
    const Template = await mailTemplatesService.getCustomTemplate(templateId);
    const Users = await userService.getUsersArray(users);

    const Mails = Users.map((user) => {
      return {
        to: user.email,
        ...Template.prepare({ user }),
      };
    });

    return Mails.forEach(async (mail) => {
      try {
        const res = await this.transporter.sendMail(mail);
        console.log(res);
      } catch (e) {
        console.log(e);
      }
    });
  }

  async sendActivationMail(to: string, activateLink: string) {
    const Template = await mailTemplatesService.getSpecialTemplate(
      MailTypes.activate
    );
    return await this.transporter.sendMail({
      to,
      subject: Template.subject,
      html: Template.html.replace("#activate-link#", activateLink),
    });
  }

  async sendResetPasswordMail(to: string, passwordResetLink: string) {
    const Template = await mailTemplatesService.getSpecialTemplate(
      MailTypes.resetpassword
    );
    return await this.transporter.sendMail({
      to,
      subject: Template.subject,
      html: Template.html.replace("#reset-link#", passwordResetLink),
    });
  }
}

export default new MailService();
