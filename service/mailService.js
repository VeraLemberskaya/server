import nodemailer from "nodemailer";
import ApiError from "../exceptions/ApiError.js";

class MailService {
  transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      name: "QuizGrad",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMPT_PASSWORD,
      },
    });
  }

  async sendActivationMail(to, subject, link) {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject,
        html: `
                  <div>
                  <h2>Click on the link below:</h2>
                  <a href="${link}">${link}</a>
                  <br/>
                  <br/>
                  <p>Best regards,</p>
                  <p><b>QuizGrad</b></p>
                  </div>
                  `,
      });
    } catch (e) {
      throw ApiError.internalServerError(e.message);
    }
  }
}

export default new MailService();
