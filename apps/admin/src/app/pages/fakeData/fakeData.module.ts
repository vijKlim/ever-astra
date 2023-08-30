import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../@theme/theme.module';
import { RouterModule } from '@angular/router';
import { routes } from './fakeData.routes';
import { FakeDataComponent } from './fakeData.component';

import FakeDataUsers from "../../@core/fakeDataServices/users";
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import {NbSpinnerModule, NbButtonModule, NbCardModule} from '@nebular/theme';

import {UsersService} from "../../@core/data/users.service";

export function HttpLoaderFactory(http: HttpClient) {
	return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    RouterModule.forChild(routes),
    NbSpinnerModule,
    NbButtonModule,
    NbCardModule,
  ],
	declarations: [FakeDataComponent],
	providers: [
		FakeDataUsers,
		UsersService,
	],
})
export class FakeDataModule {
	public static routes = routes;

	constructor() {
		console.log('`FakeData` module initialized');
	}
}
