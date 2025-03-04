import { Observable } from 'rxjs';
import {IGeoLocation} from '../interfaces/IGeoLocation';
import {Warehouse} from '../entities/Warehouse';

export interface IGeoLocationWarehousesRouterGetOptions {
	fullProducts?: boolean;
	activeOnly?: boolean;
}

export interface IGeoLocationWarehousesRouter {
	get(
		geoLocation: IGeoLocation,
		options?: IGeoLocationWarehousesRouterGetOptions
	): Observable<Warehouse[]>;
}
