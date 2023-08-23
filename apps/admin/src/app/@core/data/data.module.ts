import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from './store.service';
import { DataService } from './data.service';
import {UsersService} from "./users.service";

const SERVICES = [
	DataService,
	UsersService,
	Store
];

@NgModule({
	imports: [CommonModule],
	providers: [...SERVICES],
})
export class DataModule {
	static forRoot(): ModuleWithProviders<DataModule> {
		const providers: ModuleWithProviders<DataModule> = {
			ngModule: DataModule,
			providers: [...SERVICES],
		};

		return providers;
	}
}
