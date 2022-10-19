const config = require("config");
const nodemailer = require("nodemailer");
const getRegistrationMail = require("../mails/registration");

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
    });
  }

  async sendActivationMail(to: string, link: string, name: string) {
    await this.transporter.sendMail({
      from: config.get("smtpUser"),
      to,
      subject: `Активация аккаунта на ${config.get("APIURL")}`,
      text: "",
      html: getRegistrationMail({ name, link }),
    });
  }
  async sendResetPasswordLink(to: string, link: string) {
    await this.transporter.sendMail({
      from: config.get("smtpUser"),
      to,
      subject: `Восстановление пароля ${config.get("APIURL")}`,
      text: "",
      html: `<div>
                <h1>Для восстановления пароля перейдите по ссылке</h1>
                <a href="${link}">${link}</a>
            </div>`,
    });
  }
}

export default new MailService();
