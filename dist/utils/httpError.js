"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpError extends Error {
    constructor(opts) {
        super(opts.detail);
        this.opts = opts;
        Error.captureStackTrace(this);
    }
    sendError(res) {
        return res.status(this.opts.code).json({
            errors: [
                {
                    title: this.opts.title,
                    detail: this.opts.detail,
                    code: this.opts.code,
                },
            ],
        });
    }
}
exports.default = HttpError;
//# sourceMappingURL=httpError.js.map