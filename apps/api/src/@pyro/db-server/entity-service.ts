import {DBObject, RawObject} from "@ever-astrada/common";
import mongoose from 'mongoose';

import { injectable } from 'inversify';
import {getModel} from "./model";

@injectable()
export abstract class EntityService<T extends DBObject<any, any>> {
	public abstract readonly DBObject: {
		new (arg: RawObject<T>): T;
		modelName: string;
	};

	get Model(): any {
		return getModel<RawObject<T> & mongoose.Document>(this.DBObject);
	}

	protected getObjectId(id: T['id']) {
		return new mongoose.Types.ObjectId(id);
	}

	protected parse(obj: RawObject<T>): T;

	protected parse(obj: RawObject<T> | null): T | null {
		if (obj == null) {
			return null;
		} else {
			return new this.DBObject(obj);
		}
	}
}
