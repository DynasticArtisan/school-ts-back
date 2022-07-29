const config = require('config');
const nodemailer = require('nodemailer');
const getRegistrationMail = require('../mails/registration');

class MailService {
    constructor(){
        this.transporter = nodemailer.createTransport({
            host: config.get('smtpHost'),
            port: config.get('smtpPort'),
            secure: false,
            auth:{
                user: config.get('smtpUser'),
                pass: config.get('googlePass')
            }
        })
    }

    async sendActivationMail(to, link, name){
        await this.transporter.sendMail({
            from: config.get('smtpUser'),
            to,
            subject: `Активация аккаунта на ${config.get("APIURL")}`,
            text:'',
            html: getRegistrationMail({ name, link })
        })
    }
    async sendResetPasswordLink(to, link){
        await this.transporter.sendMail({
            from: config.get('smtpUser'),
            to,
            subject: `Восстановление пароля ${config.get("APIURL")}`,
            text:'',
            html:`<div>
                        <h1>Для восстановления пароля перейдите по ссылке</h1>
                        <a href="${link}">${link}</a>
                    </div>`
        })
    }
}

module.exports = new MailService()