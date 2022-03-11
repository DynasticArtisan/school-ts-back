const config = require('config');
const nodemailer = require('nodemailer');

class MailService {
    constructor(){
        this.transporter = nodemailer.createTransport({
            host: config.get('smtpHost'),
            port: config.get('smtpPort'),
            secure: false,
            auth:{
                user: config.get('smtpUser'),
                pass: config.get('smtpPassword')
            }
        })
    }

    async sendActivationMail(to, link){
        await this.transporter.sendMail({
            from: config.get('smtpUser'),
            to,
            subject: `Активация аккаунта на ${config.get("APIURL")}`,
            text:'',
            html:`<div>
                        <h1>Для активации аккаунта перейдите по ссылке</h1>
                        <a href="${link}">${link}</a>
                    </div>`
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