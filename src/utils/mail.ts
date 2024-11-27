import { envConfig } from "../configs/env.config";
import logger from "../configs/logger.config";
import { mailTransporter } from "../configs/mail.config";
import Mail from "nodemailer/lib/mailer";

interface ExtendedMailOptions extends Mail.Options {
  template?: string;
  context?: object;
}

interface GenerateMailOptionsProps {
  receiverEmail: string;
  subject?: string;
  template?: string;
  context?: object;
}

export const sendMail = async (mailOptions: ExtendedMailOptions) => {
  await mailTransporter.sendMail(mailOptions);
  logger.info(`Mail sent successfully to ${mailOptions.to}`);
};

export const generateMailOptions = ({
  receiverEmail,
  subject = "Testing nodemailer",
  template = "reset-password",
  context = {
    name: "testing",
  },
}: GenerateMailOptionsProps): ExtendedMailOptions => {
  return {
    from: `"No Reply" <${envConfig.NODEMAILER_DEFAULT_SENDER}>`,
    to: receiverEmail,
    subject: subject,
    template: template,
    context: {
      ...context,
      appName: envConfig.NAME,
    },
  };
};
