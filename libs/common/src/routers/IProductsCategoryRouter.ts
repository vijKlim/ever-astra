import { Observable } from 'rxjs';
import {ProductsCategory} from '../entities/ProductsCategory';
import {CreateObject, UpdateObject} from "../@pyro/db";

export interface IProductsCategoryRouter {
	get(id: ProductsCategory['id']): Observable<ProductsCategory | null>;

	create(
		createInput: CreateObject<ProductsCategory>
	): Promise<ProductsCategory>;

	update(
		id: ProductsCategory['id'],
		updateInput: UpdateObject<ProductsCategory>
	): Promise<ProductsCategory>;

	remove(id: ProductsCategory['id']): Promise<void>;
}
