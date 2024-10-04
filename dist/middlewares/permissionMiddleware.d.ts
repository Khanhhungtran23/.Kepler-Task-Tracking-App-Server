import { Request, Response, NextFunction } from 'express';
declare const permit: (allowedRoles: Array<string>) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export default permit;
