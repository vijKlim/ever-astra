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


import {
  User,
  IPagingOptions,
  IUserRouter,
  IUserCreateObject,
  IGeoLocationCreateObject,
  Country, GeoLocation
} from "@ever-astrada/common";

import {Observable} from 'rxjs';
import _ = require('lodash');
import {faker} from '@faker-js/faker';

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
   * Generates Fake Customer records
   * TODO: move to separate FakeUsersService (put into 'fake-data' folder)
   * TODO: rename method to "generateCustomers"
   *
   * @param {number} defaultLng
   * @param {number} defaultLat
   * @returns {Promise<IUserCreateObject[]>}
   * @memberof UsersService
   */
  async generate1000Customers(
    defaultLng: number,
    defaultLat: number
  ): Promise<IUserCreateObject[]> {
    const existingEmails = _.map(
      await this.Model.find({}).select({ email: 1 }).lean().exec(),
      (u) => u.email
    );

    const customersToCreate: IUserCreateObject[] = [];

    const customerCreatedFrom = new Date(2015, 1);
    const customerCreatedTo = new Date();

    let customerCount = 1;

    while (customerCount <= 1000) {
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      const email = faker.internet.email(firstName, lastName);
      const isBanned = Math.random() < 0.02;

      const geoLocation: IGeoLocationCreateObject = {
        countryId: faker.number.int(Country.ZW) as Country,
        city: faker.address.city(),
        house: `${customerCount}`,
        loc: {
          type: 'Point',
          coordinates: [defaultLng, defaultLat],
        },
        streetAddress: faker.address.streetAddress(),
      };

      if (!existingEmails.includes(email)) {
        existingEmails.push(email);

        customersToCreate.push({
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          geoLocation,
          apartment: `${customerCount}`,
          email,
          isBanned,
          image: faker.image.avatar(),
          phone: faker.phone.number(),
          _createdAt: faker.date.between(
            customerCreatedFrom,
            customerCreatedTo
          ),
        } as any);

        customerCount += 1;
      }
    }

    return this.Model.insertMany(customersToCreate);
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
