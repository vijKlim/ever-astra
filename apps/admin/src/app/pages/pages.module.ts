import { NgModule } from '@angular/core';
import {NbIconModule, NbMenuModule, NbToastrModule} from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { PagesRoutingModule } from './pages-routing.module';
import {TranslateModule} from "../@shared/translate/translate.module";

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    NbIconModule,
    NbToastrModule.forRoot(),
    DashboardModule,
    TranslateModule
  ],
  declarations: [
    PagesComponent,
  ],
})
export class PagesModule {
}
