import { IGeoLocation, IGeoLocationCreateObject } from './IGeoLocation';
import { DBCreateObject, DBRawObject, PyroObjectId } from '../@pyro/db';

export interface IUserInitializeObject extends DBCreateObject {
	firstName?: string;
	lastName?: string;
	email?: string;
	phone?: string;
	image?: string;
	socialIds?: string[];
	isRegistrationCompleted?: boolean;
	hash?: string;
	isBanned?: boolean;
}

export interface IUserCreateObject extends IUserInitializeObject {
	geoLocation: IGeoLocationCreateObject;
	devicesIds?: string[];
	apartment?: string;
	stripeCustomerId?: string;
}

export interface IResponseGenerate1000Customers {
	success: boolean;
	message: string;
}

export interface IUser extends IUserCreateObject, IUserInitializeObject, DBRawObject {
	_id: PyroObjectId;
	geoLocation: IGeoLocation;
	devicesIds: string[];
	readonly fullAddress: string;
}

export enum LanguagesEnum {
  ENGLISH = 'en',
  RUSSIAN = 'ru',
}

export enum ComponentLayoutStyleEnum {
  CARDS_GRID = 'CARDS_GRID',
  TABLE = 'TABLE'
}

export interface IUserViewModel {
  id: string;
  name: string;
  image: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  address: string;
  ordersQty: number;
  isBanned: boolean;
}

export interface IUserFindInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}
