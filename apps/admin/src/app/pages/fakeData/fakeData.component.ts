import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { DataService } from '../../@core/data/data.service';
import { environment } from 'environments/environment';
import {User} from "@ever-astrada/common";
import {FakeDataBtnState} from "./FakeDataBtnState";
import FakeDataUsers from "../../@core/fakeDataServices/users";
import {UsersService} from "../../@core/data/users.service";


const NEED_DEFAULT_SETTINGS_MESSAGE =
	"Can't generate fake data without DEFAULT_LONGITUDE and DEFAULT_LATITUDE";
const lng = environment['DEFAULT_LONGITUDE'];
const lat = environment['DEFAULT_LATITUDE'];

@Component({
	selector: 'ea-fake-data',
	templateUrl: './fakeData.component.html',
	styleUrls: ['./fakeData.component.scss'],
})
export class FakeDataComponent implements  OnDestroy {

	user: User;


	public loading: FakeDataBtnState;
	public isBtnDisabled: FakeDataBtnState;

	private _ngDestroy$ = new Subject<void>();

	constructor(
		protected fakeDataUsers: FakeDataUsers,
		private readonly _dataService: DataService,
		private readonly _usersService: UsersService,
	) {
		this._setupButtonStatuses();
		this._setupButtonLoading();
	}


	private get _notify() {
		const showMessage = (message: string) =>
			console.log(message);
		const errror = (message: string) => console.error(message);

		return {
			invite: (id) =>
				showMessage(`Invite with id "${id}" created successfully`),
			user: (id) =>
				showMessage(`User with id "${id}" created successfully`),
			carrier: (id) =>
				showMessage(`Carrier with id "${id}" created successfully`),
			product: (id) =>
				showMessage(`Product with id "${id}" created successfully`),
			warehouse: (id) =>
				showMessage(`Warehouse with id "${id}" created successfully`),
			warehouseAddProducts: (id) =>
				showMessage(
					`Warehouse with id "${id}" added products successfully`
				),
			geoLocation: (id) =>
				showMessage(`Warehouse with id "${id}" update geo location`),
			order: (id) =>
				showMessage(`Order with id "${id}" created successfully`),
			confirmOrder: (id) =>
				showMessage(`Order with id "${id}" confirmed`),
			clearAll: () => showMessage('All data was removed from database'),
			generateRandomOrdersPerStore: (storeId, ordersCount) =>
				showMessage(
					`Store with id "${storeId}" has new ${ordersCount} orders.`
				),
			errorGenerate: (msg) => errror(msg),
		};
	}

	async callAll() {
		this.isBtnDisabled.all = true;
		this.loading.all = true;


		await this._generate1000Customers();

		this.isBtnDisabled.all = false;
		this.loading.all = false;
	}

	async clearAll() {
		if (window.confirm('Are you sure?')) {
			this.isBtnDisabled.clearAll = true;
			this.loading.clearAll = true;
			await this._dataService.clearAll();
			this.isBtnDisabled.clearAll = false;
			this.loading.clearAll = false;

			this._notify.clearAll();
		}
	}


	private _setupButtonLoading() {
		this.isBtnDisabled = new FakeDataBtnState();
	}

	private _setupButtonStatuses() {
		this.loading = new FakeDataBtnState();
	}

	private async _generate1000Customers() {
		if (lng && lat) {
			const response = await this._usersService // maybe _usersService?
				.generate1000Customers(lng, lat)
				.toPromise();

			if (!response.success) {
				this._notify.errorGenerate(response.message);
			}
		} else {
			console.warn(NEED_DEFAULT_SETTINGS_MESSAGE);
		}
	}

	ngOnDestroy() {
		this._ngDestroy$.next();
		this._ngDestroy$.complete();
	}
}
