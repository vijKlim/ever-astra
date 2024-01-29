import { Observable } from 'rxjs';
import {User} from '../entities/User';
import {Warehouse} from '../entities/Warehouse';

export interface IWarehouseUsersRouter {
	get(warehouseId: Warehouse['id']): Observable<User[]>;
}


