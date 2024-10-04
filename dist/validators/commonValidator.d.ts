declare const booleanValidator: (field: any, messageName: any, options?: {
    type: string;
    optional: boolean;
    allow: any[];
}) => any;
declare const requiredTextField: (field: string, messageName: string, options: {
    min: number;
    max: number;
}) => import("express-validator").ValidationChain;
declare const optionalTextField: (field: string, messageName: string, options: {
    min: number;
    max: number;
    nullable: boolean;
}) => import("express-validator").ValidationChain;
export { booleanValidator, requiredTextField, optionalTextField };
