import { NgModule } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { Angular2SmartTableModule } from 'angular2-smart-table';
// import { ToasterModule } from 'angular2-toaster';
import { TranslateModule } from '@ngx-translate/core';
import { CustomersComponent } from './customers.component';

// import { HighlightModule } from 'ngx-highlightjs';
// import { RenderComponentsModule } from '../../@shared/render-component/render-components.module';
// import { GeoLocationService } from '../../@core/data/geo-location.service';
// import { UserMutationModule } from '../../@shared/user/user-mutation';
// import { CustomerTableModule } from '../../@shared/render-component/customer-table/customer-table.module';
import {NbSpinnerModule, NbButtonModule, NbCardModule} from '@nebular/theme';
// import { ThemeModule } from '../../@theme';
import {ThemeModule} from "../../@theme/theme.module";
// import { NotifyService } from '@app/@core/services/notify/notify.service';
// import { BanConfirmModule } from '@app/@shared/user/ban-confirm';

const routes: Routes = [
	{
		path: '',
		component: CustomersComponent,
	}
];

@NgModule({
  imports: [
    CommonModule,
    Angular2SmartTableModule,
    ThemeModule,
    // ToasterModule.forRoot(),
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
    // HighlightModule,
    // RenderComponentsModule,
    // UserMutationModule,
    // CustomerTableModule,
    NbSpinnerModule,
    // BanConfirmModule,
    NbButtonModule,
    NbCardModule,
  ],
	declarations: [CustomersComponent],
	providers: [
    // GeoLocationService,
    // NotifyService,
    JsonPipe
  ],
})
export class CustomersModule {
	public static routes = routes;
}
