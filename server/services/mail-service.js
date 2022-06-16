const nodemailer = require('nodemailer')

class MailService {

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.smtp_host,
            port: process.env.smtp_port,
            secure: false, // upgrade later with STARTTLS
            auth: {
                user: process.env.smtp_user,
                pass: process.env.smtp_password,
            },
        });
    }

    async sendActivationLink(to, link) {
        await this.transporter.sendMail({
            from: process.env.smtp_user,
            to,
            subject: 'Активация аккаунта на ',
            text: '',
            html:
                `
                    <div>
                        <h1>Для активации перейдите по ссылке</h1>
                        <a href="${link}">${link}</a>
                    </div>
                `
        })
    }
}

module.exports = new MailService()