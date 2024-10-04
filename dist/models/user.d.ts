import mongoose, { Document } from 'mongoose';
import { IUser } from '../interfaces';
export interface IUserModel extends IUser, Document {
}
declare const _default: mongoose.Model<IUserModel, {}, {}, {}, any>;
export default _default;
