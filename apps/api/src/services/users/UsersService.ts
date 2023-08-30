import Logger from 'bunyan';
import { inject, injectable, LazyServiceIdentifer } from 'inversify';
import { createEverLogger } from '../../helpers/Log';

import {DBService} from "../../@pyro/db-server";
import {routerName} from "../../@pyro/io";
import IService from '../IService';

import {
	distinctUntilChanged,
	exhaustMap,
	first,
	publishReplay,
	refCount,
	switchMap,
	tap,
	map,
} from 'rxjs/operators';


import {User, IPagingOptions, IUserRouter, IUserCreateObject} from "@ever-astrada/common";
import GeoLocation from 'libs/common/src/entities/GeoLocation';
import {Observable} from 'rxjs';


/**
 * Customers Service
 * TODO: rename from UsersService to CustomersService
 *
 * @export
 * @class UsersService
 * @extends {DBService<User>}
 * @implements {IUserRouter}
 * @implements {IService}
 */
@injectable()
@routerName('user')
export class UsersService
  extends DBService<User>
  implements IUserRouter, IService {
  public readonly DBObject: any = User;

  protected readonly log: Logger = createEverLogger({
    name: 'usersService',
  });

  constructor() {
    super();
  }

  updateUser(id: string, user: IUserCreateObject): Promise<User> {
      throw new Error('Method not implemented.');
  }
  addPaymentMethod(userId: string, tokenId: string): Promise<string> {
      throw new Error('Method not implemented.');
  }
  updateEmail(userId: string, email: string): Promise<User> {
      throw new Error('Method not implemented.');
  }
  updateGeoLocation(userId: string, geoLocation: GeoLocation): Promise<User> {
      throw new Error('Method not implemented.');
  }
  getAboutUs(userId: string, selectedLanguage: string): Observable<string> {
      throw new Error('Method not implemented.');
  }
  getTermsOfUse(userId: string, selectedLanguage: string): Observable<string> {
      throw new Error('Method not implemented.');
  }
  getHelp(userId: string, selectedLanguage: string): Observable<string> {
      throw new Error('Method not implemented.');
  }
  getPrivacy(userId: string, selectedLanguage: string): Observable<string> {
      throw new Error('Method not implemented.');
  }



	/**
	 * Get Customers
	 *
	 * @param {*} findInput
	 * @param {IPagingOptions} pagingOptions
	 * @returns
	 * @memberof UsersService
	 */
	async getUsers(findInput: any, pagingOptions: IPagingOptions) {
		const sortObj = {};
		if (pagingOptions.sort) {
			sortObj[pagingOptions.sort.field] = pagingOptions.sort.sortBy;
		}
this.log.info('FFFFFFFFFFFFFFFFFFFFF')
		return this.Model.find({
			...findInput,
			isDeleted: { $eq: false },
		})
			.sort(sortObj)
			.skip(pagingOptions.skip)
			.limit(pagingOptions.limit)
			.lean()
			.exec();
	}


	/**
	 * Check if not deleted customer with given Id exists in DB and throw exception if it's not exists or deleted
	 *
	 * @param {string} userId
	 * @memberof UsersService
	 */
	async throwIfNotExists(userId: string) {
		const user = await super.get(userId).pipe(first()).toPromise();

		if (!user || user.isDeleted) {
			throw Error(`Customer with id '${userId}' does not exists!`);
		}
	}
}
