import { IGeoLocation, IGeoLocationCreateObject } from './IGeoLocation';
import { DBCreateObject, DBRawObject, PyroObjectId } from '../@pyro/db';
import {IRelationalImageAsset} from "./IImageAsset";

export interface IUserInitializeObject extends DBCreateObject, IRelationalImageAsset {
	firstName?: string;
	lastName?: string;
	email?: string;
	phone?: string;
  imageUrl?: string;
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

export interface  IUser extends IUserCreateObject, IUserInitializeObject, DBRawObject {
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

export interface IUserCreateInput extends IRelationalImageAsset {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  username?: string;
  roleId?: string;
  hash?: string;
  imageUrl?: string;
  preferredLanguage?: LanguagesEnum;
  preferredComponentLayout?: ComponentLayoutStyleEnum;
  timeZone?: string;
}

export interface IUserUpdateInput extends IUserCreateInput {
  id?: string;
}
