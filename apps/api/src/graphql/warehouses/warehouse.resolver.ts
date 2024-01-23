import { Mutation, Query, ResolveField, Resolver } from '@nestjs/graphql';

import {
  IGeoLocation,
  IGeoLocationCreateObject,
  ILocation,
  IWarehouse,
  IWarehouseRegistrationInput,
  GeoLocation,
  Warehouse,
  User,
  Utils
} from '@ever-astrada/common';
import {
	WarehousesCarriersService,
	WarehousesOrdersService,
	WarehousesService,
	WarehousesUsersService,
	WarehousesProductsService,
} from '../../services/warehouses';

import { UsersService } from '../../services/users';
import { GeoLocationsWarehousesService } from '../../services/geo-locations';
import { first } from 'rxjs/operators';


@Resolver('Warehouse')
export class WarehouseResolver {
	constructor(
		private readonly _geoLocationWarehousesService: GeoLocationsWarehousesService,
		private readonly _warehousesService: WarehousesService,
		private readonly _warehousesOrdersService: WarehousesOrdersService,
		private readonly _warehousesUsersService: WarehousesUsersService,
		private readonly _warehousesCarriersService: WarehousesCarriersService,
		private readonly _warehouseProductsService: WarehousesProductsService,
		private readonly _usersService: UsersService
	) {}

	@Query()
	async hasExistingStores(): Promise<boolean> {
		return (await this._warehousesService.count({})) > 0;
	}

	@Query()
	async getStoreProducts(
		_,
		{ storeId, fullProducts }: { storeId: string; fullProducts: boolean }
	) {
		return this._warehouseProductsService
			.get(storeId, fullProducts)
			.pipe(first())
			.toPromise();
	}

	@Query()
	async getStoreAvailableProducts(_, { storeId }: { storeId: string }) {
		return this._warehouseProductsService
			.getAvailable(storeId)
			.pipe(first())
			.toPromise();
	}

	@Query()
	async getAllActiveStores(_, { fullProducts }: { fullProducts: boolean }) {
		return this._warehousesService
			.getAllActive(fullProducts)
			.pipe(first())
			.toPromise();
	}

	@Query()
	async countStoreCustomers(_, { storeId }: { storeId: string }) {
		const storeOrders = await this._warehousesOrdersService
			.get(storeId)
			.pipe(first())
			.toPromise();

		const storeCustomerIds = storeOrders.map((order) =>
			order.user._id.toString()
		);

		return new Set(storeCustomerIds).size;
	}

	@Query('nearbyStores')
	async getNearbyStores(_, { geoLocation }) {
		return this._geoLocationWarehousesService
			.get(geoLocation)
			.pipe(first())
			.toPromise();
	}

	// @UseGuards(AuthGuard('jwt'))
	@Query('warehouse')
	async getWarehouse(_, { id }: { id: string }) {
		return this._warehousesService.get(id).pipe(first()).toPromise();
	}

	@Query()
	async getAllStores() {
		return this._warehousesService.find({ isDeleted: { $eq: false } });
	}

	@Query('warehouses')
	async getWarehouses(_, { findInput, pagingOptions = {} }) {
		if (!pagingOptions || (pagingOptions && !pagingOptions['sort'])) {
			pagingOptions['sort'] = { field: '_createdAt', sortBy: 'desc' };
		}

		const merchants = await this._warehousesService.getMerchants(
			findInput,
			pagingOptions
		);

		return merchants.map((m) => new Warehouse(m));
	}

	@Query()
	async getStoreCustomers(
		_,
		{ storeId }: { storeId: string }
	): Promise<User[]> {
		return this._warehousesUsersService.getPromise(storeId);
	}

	@Query()
	async getCountOfMerchants() {
		return this._warehousesService.Model.find({ isDeleted: { $eq: false } })
			.countDocuments()
			.exec();
	}

	@Query()
	async getMerchantsBuyName(
		_,
		{
			searchName,
			geoLocation,
		}: { searchName: string; geoLocation: IGeoLocation }
	) {
		const count = await this._warehousesService.Model.find({
			name: { $regex: searchName, $options: 'i' },
		})
			.countDocuments()
			.exec();

		let merchants = await this._warehousesService.getMerchants(
			{ name: { $regex: searchName, $options: 'i' } },
			{ skip: 0, limit: count }
		);

		if (geoLocation) {
			merchants = merchants.sort(
				(m1, m2) =>
					Utils.getDistance(
						new GeoLocation(m1.geoLocation),
						new GeoLocation(geoLocation)
					) -
					Utils.getDistance(
						new GeoLocation(m2.geoLocation),
						new GeoLocation(geoLocation)
					)
			);
		}

		return merchants.map((m) => new Warehouse(m));
	}

	@Mutation()
	async warehouseLogin(
		_,
		{ username, password }: { username: string; password: string }
	) {
		return this._warehousesService.login(username, password);
	}

	@Mutation()
	async updateStoreGeoLocation(
		_,
		{
			storeId,
			geoLocation,
		}: {
			storeId: string;
			geoLocation: IGeoLocationCreateObject;
		}
	) {
		return this._warehousesService.updateGeoLocation(storeId, geoLocation);
	}

	@Mutation()
	async registerWarehouse(
		_,
		{ registerInput }: { registerInput: IWarehouseRegistrationInput }
	) {
		return this._warehousesService.register(registerInput);
	}

	@Mutation()
	async removeWarehousesByIds(_, { ids }: { ids: string[] }) {
		return this._warehousesService.removeMultipleByIds(ids);
	}

	@ResolveField('orders')
	async getOrders(_warehouse: IWarehouse) {
		const warehouse = new Warehouse(_warehouse);
		return this._warehousesOrdersService
			.get(warehouse.id)
			.pipe(first())
			.toPromise();
	}

	@ResolveField('users')
	async getUsers(_warehouse: IWarehouse) {
		const warehouse = new Warehouse(_warehouse);

		return this._warehousesUsersService
			.get(warehouse.id)
			.pipe(first())
			.toPromise();
	}

	@ResolveField('carriers')
	async getCarriers(_warehouse: IWarehouse) {
		const warehouse = new Warehouse(_warehouse);

		return this._warehousesCarriersService
			.get(warehouse.id)
			.pipe(first())
			.toPromise();
	}

	@Mutation()
	async updateWarehousePassword(
		_,
		{
			id,
			password,
		}: { id: Warehouse['id']; password: { current: string; new: string } }
	) {
		return this._warehousesService.updatePassword(id, password);
	}
}
