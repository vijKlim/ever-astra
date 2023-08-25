import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbRoleProvider, NbSecurityModule } from '@nebular/security';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { DataModule } from './data/data.module';
import { AnalyticsService } from './utils/analytics.service';
import { AuthModule } from './auth/auth.module';
import { NbEverRoleProvider } from './roleProvider';
import {LayoutService} from "./utils/layout.service";

export const NB_CORE_PROVIDERS = [
  ...DataModule.forRoot().providers,

  NbSecurityModule.forRoot({
    accessControl: {
      guest: {
        view: '*',
      },
      user: {
        parent: 'guest',
        create: '*',
        edit: '*',
        remove: '*',
      },
    },
  }).providers,
  {
    provide: NbRoleProvider,
    useClass: NbEverRoleProvider,
  },
  AnalyticsService,
  LayoutService
];

@NgModule({
  imports: [AuthModule, CommonModule],
  declarations: [],
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
      parentModule: CoreModule
  ) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

  static forRoot(): ModuleWithProviders<CoreModule> {
    const providers: ModuleWithProviders<CoreModule> = {
      ngModule: CoreModule,
      providers: [...NB_CORE_PROVIDERS],
    };

    return providers;
  }
}
