import { Request, Response, NextFunction } from 'express';
declare const auth: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export default auth;
