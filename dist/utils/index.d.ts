declare const generateJWT: (payload?: object, options?: object) => string;
declare const generateForgotPasswordJWT: (password: string, payload?: object, options?: object) => string;
declare const validateToken: (token: string) => Object;
declare const validateForgotPasswordJWT: (password: string, token: string) => Object;
declare const extractToken: (token: string) => string | null;
declare const generateRandomPassword: (len: number) => string;
declare const generateOtp: (len: number) => string;
declare const verifyOtp: (userId: any, otp: string, type: string) => Promise<any>;
export { generateJWT, generateForgotPasswordJWT, validateToken, validateForgotPasswordJWT, extractToken, generateRandomPassword, generateOtp, verifyOtp, };
