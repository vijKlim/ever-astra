import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { first } from 'rxjs/operators';
import { ProductsService } from '../../services/products';
import {
	WarehousesService,
} from '../../services/warehouses';
import { Product } from '@ever-astrada/common';

@Resolver('Product')
export class ProductResolver {
	constructor(
		private readonly _productsService: ProductsService,
		private readonly _warehousesService: WarehousesService
	) {}

	@Query('product')
	async getProduct(_, { id }: { id: string }) {
		return this._productsService.get(id).pipe(first()).toPromise();
	}

	@Query('products')
	async getProducts(
		_,
		{ findInput, pagingOptions = {}, existedProductsIds = [] }
	) {
		if (!pagingOptions || (pagingOptions && !pagingOptions['sort'])) {
			pagingOptions['sort'] = { field: '_createdAt', sortBy: 'desc' };
		}

		const products = await this._productsService.getProducts(
			findInput,
			pagingOptions,
			existedProductsIds
		);

		return products.map((p) => new Product(p));
	}

	@Query()
	async getCountOfProducts(_, { existedProductsIds = [] }) {
		return this._productsService.Model.find({
			isDeleted: { $eq: false },
			_id: { $nin: existedProductsIds },
		})
			.countDocuments()
			.exec();
	}

	@Mutation()
	// @UseGuards(AuthGuard('jwt'))
	async saveProduct(_, { product }: { product }) {
		const productId = product['_id'];
		await this._productsService.throwIfNotExists(productId);

		product.id = productId;
		return this._productsService.save(product);
	}

	@Mutation()
	async createProduct(_, { product }: { product }) {
		return this._productsService.create(product);
	}
}
