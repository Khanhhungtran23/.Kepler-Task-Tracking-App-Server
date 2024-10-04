declare const authorization: () => import("express-validator").ValidationChain;
declare const emailAddress: () => import("express-validator").ValidationChain;
declare const loginPassword: () => import("express-validator").ValidationChain;
export { authorization, emailAddress, loginPassword, };
