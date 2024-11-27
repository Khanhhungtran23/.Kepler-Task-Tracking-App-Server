export class CustomError extends Error {
  statusCode: number;
  status: string;
  data?: string | object;
  section?: string;

  constructor(
    message: string,
    statusCode: number,
    section?: string,
    data?: string | object,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? "failed" : "";
    this.data = data;
    this.section = section;

    Error.captureStackTrace(this, this.constructor);
  }
}
