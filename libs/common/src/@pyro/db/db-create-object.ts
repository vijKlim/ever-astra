import { PyroObjectId } from './object-id';
import {DBObject} from "./db-object";

export interface DBCreateObject {
	_id?: PyroObjectId;
}

export type CreateObject<T extends DBObject<any, any>> = T['CreateObjectTYPE'];
