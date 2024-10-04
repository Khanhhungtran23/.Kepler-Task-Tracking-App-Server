import { MailInterface } from '../interfaces';
export default class MailService {
    private static instance;
    private transporter;
    private constructor();
    static getInstance(): MailService;
    createLocalConnection(): Promise<void>;
    createConnection(): Promise<void>;
    sendMail(requestId: string | number | string[], options: MailInterface): Promise<any>;
    verifyConnection(): Promise<any>;
    getTransporter(): nodemailer.Transporter;
}
