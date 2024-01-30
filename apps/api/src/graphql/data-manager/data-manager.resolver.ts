import {Query, Resolver} from "@nestjs/graphql";
import {User} from "@ever-astrada/common";
import { UsersService } from '../../services/users';

@Resolver('DataManager')
export class DataManagerResolver {

  constructor(
    private readonly _usersService: UsersService
  ) {}

  @Query('getUsers')
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
