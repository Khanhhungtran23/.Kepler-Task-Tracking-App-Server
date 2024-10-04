import { ApiErrorInterface } from "../interfaces";
export default class HttpError extends Error {
    readonly opts: ApiErrorInterface;
    constructor(opts: ApiErrorInterface);
    sendError(res: any): any;
}
