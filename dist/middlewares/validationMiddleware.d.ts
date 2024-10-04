import { NextFunction, Request, Response } from 'express';
declare const validate: (validations: any) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export default validate;
