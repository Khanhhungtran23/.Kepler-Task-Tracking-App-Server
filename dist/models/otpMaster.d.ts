import mongoose, { Document } from 'mongoose';
import { IOtp } from '../interfaces';
export interface IOtpModel extends IOtp, Document {
}
declare const _default: mongoose.Model<IOtpModel, {}, {}, {}, any>;
export default _default;
