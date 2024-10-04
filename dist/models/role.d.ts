import mongoose, { Document } from 'mongoose';
import { IRole } from '../interfaces';
export interface IRoleModel extends IRole, Document {
}
declare const _default: mongoose.Model<IRoleModel, {}, {}, {}, any>;
export default _default;
