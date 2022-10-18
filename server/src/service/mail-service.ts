const nodemailer = require("nodemailer");

class MailService {
        transporter;
        constructor() {
                this.transporter = nodemailer.createTransport({
                        host: "smtp.gmail.com",
                        port: 465,
                        secure: true, // true for 465, false for other ports
                        auth: {
                                user: "pro100topchannal@gmail.com",
                                pass: "gznvbryxbjivsrqj"
                        }
                },
                    {
                            from: "KeyStore <pro100topchannal@gmail.com>"
                    })

        }

        async sendActivation(to: string, link: string) {
                const mail = await this.transporter.sendMail({
                        to,
                        subject: "Активация аккаунта на " + process.env.API_URL,
                        text: "",
                        html:
                        `
                             <div>
                                <h1>Для активации перейдите по ссылке</h1>
                                <a href="${link}">${link}</a>
                             </div>   
                        `
                });
        }
}

export default new MailService();