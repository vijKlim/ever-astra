import { Mutation, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UsersService } from '../../services/users';

import {
  User,
  IUser,
	IUserCreateObject,
	IResponseGenerate1000Customers,
} from '@ever-astrada/common';


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

}
