import { Mutation, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UsersService } from '../../services/users';

import {
  User,
  IUser,
	IUserCreateObject,
	IResponseGenerate1000Customers,
} from '@ever-astrada/common';
import {FakeDataGuard} from "../../auth/guards/fake-data.guard";
import {UseGuards} from "@nestjs/common";
import {first} from "rxjs/operators";


@Resolver('User')
export class UserResolver {
	constructor(
		private readonly _usersService: UsersService

	) {}

	@Query('users')
	async getUsers(_, { findInput, pagingOptions = {} }) {
		if (!pagingOptions || (pagingOptions && !pagingOptions['sort'])) {
			pagingOptions['sort'] = { field: '_createdAt', sortBy: 'desc' };
		}

		const users = await this._usersService.getUsers(
			findInput,
			pagingOptions
		);

		return users.map((u) => new User(u));
	}

  @Query('getCountOfUsers')
  async getCountOfUsers(_, { findInput }): Promise<number> {
    const searchParam = {
      isDeleted: { $eq: false }
    };

    if (findInput) {
      if (findInput.name) {
        searchParam['firstName'] = {$regex: findInput.name, $options: 'i'};
        searchParam['secondName'] = {$regex: findInput.name, $options: 'i'};
      }

      if (findInput.email) {
        searchParam['email'] = {$regex: findInput.email, $options: 'i'};
      }
    }

    return this._usersService.Model.find()
      .countDocuments(searchParam)
      .exec();
  }

  @Query()
  @UseGuards(FakeDataGuard)
  async generate1000Customers(
    _,
    { defaultLng, defaultLat }: { defaultLng: number; defaultLat: number }
  ): Promise<IResponseGenerate1000Customers> {
    let success = true;
    let message = null;

    try {
      // await this._ordersService.generateOrdersPerEachCustomer(
      //   await this._usersService.generate1000Customers(
      //     defaultLng,
      //     defaultLat
      //   )
      // );
      await this._usersService.generate1000Customers(
        defaultLng,
        defaultLat
      )
    } catch (err) {
      message = err.message;
      success = false;
    }

    return {
      success,
      message,
    };
  }

  @Query('user')
  async getUser(_, { id }) {
    return this._usersService.get(id).pipe(first()).toPromise();
  }
}
