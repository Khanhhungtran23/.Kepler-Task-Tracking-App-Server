import "nodemailer";

declare module "nodemailer" {
  export interface SendMailOptions {
    template?: string;
  }
}
