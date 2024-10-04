import { Response } from '../interfaces';
declare const jsonAll: <Res>(res: any, status: number, data: Res | Res[], meta?: Object) => Response<Res>;
declare const jsonOne: <Res>(res: any, status: number, data: Res) => Res;
export { jsonAll, jsonOne };
