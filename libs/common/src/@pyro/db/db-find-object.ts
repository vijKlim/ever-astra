import {DBObject} from "./db-object";

// TODO maybe use here the new type mapping feature.
export type FindObject<T extends DBObject<any, any>> = any;
