import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NbActionsModule,
  NbLayoutModule,
  NbMenuModule,
  NbSearchModule,
  NbSidebarModule,
  NbUserModule,
  NbContextMenuModule,
  NbButtonModule,
  NbSelectModule,
  NbIconModule,
  NbThemeModule, NbAccordionModule, NbTooltipModule,
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbSecurityModule } from '@nebular/security';

import {
  FooterComponent,
  HeaderComponent,
  LayoutDirectionSwitcherComponent,
  SearchInputComponent,
  SwitcherComponent,
} from './components';
import {
  CapitalizePipe,
  PluralPipe,
  RoundPipe,
  TimingPipe,
  NumberWithCommasPipe,
} from './pipes';
import {
  OneColumnLayoutComponent,
  ThreeColumnsLayoutComponent,
  TwoColumnsLayoutComponent,
} from './layouts';
import { DEFAULT_THEME } from './styles/theme.default';
import { COSMIC_THEME } from './styles/theme.cosmic';
import { CORPORATE_THEME } from './styles/theme.corporate';
import { DARK_THEME } from './styles/theme.dark';
import {WindowModeBlockScrollService} from "./services";
import {UserMenuComponent} from "./components/user-menu/user-menu.component";
import {TranslateModule} from "../@shared/translate/translate.module";
import {GAUZY_LIGHT} from "./styles/gauzy/theme.gauzy-light";
import {MATERIAL_LIGHT_THEME} from "./styles/material/theme.material-light";
import {MATERIAL_DARK_THEME} from "./styles/material/theme.material-dark";
import {GAUZY_DARK} from "./styles/gauzy/theme.gauzy-dark";
import {ThemeSidebarModule} from "./components/theme-sidebar/theme-sidebar.module";
import {MatRippleModule} from "@angular/material/core";
import {UserComponent} from "./components/user/user.component";
import {PopupComponent} from "./components/popup/popup.component";
import {
  ThemeSelectorModule
} from "./components/theme-sidebar/theme-settings/components/theme-selector/theme-selector.module";
import {SidebarMenuModule} from "../@shared/sidebar-menu/sidebar-menu.module";
import {LanguagesService} from "../@core/services";
import {GauzyLogoComponent} from "./components/gauzy-logo/gauzy-logo.component";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";

const NB_MODULES = [
  NbLayoutModule,
  NbMenuModule,
  NbUserModule,
  NbActionsModule,
  NbSearchModule,
  NbSidebarModule,
  NbContextMenuModule,
  NbSecurityModule,
  NbButtonModule,
  NbSelectModule,
  NbIconModule,
  NbEvaIconsModule,
  NbAccordionModule,
  NbTooltipModule
];

const MODULES = [
  TranslateModule,
  ThemeSelectorModule,
  SidebarMenuModule,
  FontAwesomeModule
];

const COMPONENTS = [
  SwitcherComponent,
  LayoutDirectionSwitcherComponent,
  HeaderComponent,
  FooterComponent,
  SearchInputComponent,
  OneColumnLayoutComponent,
  ThreeColumnsLayoutComponent,
  TwoColumnsLayoutComponent,
  UserMenuComponent,
  UserComponent,
  PopupComponent,
  GauzyLogoComponent
];
const PIPES = [
  CapitalizePipe,
  PluralPipe,
  RoundPipe,
  TimingPipe,
  NumberWithCommasPipe,
];

const EXPORT_IMPORT = [CommonModule, ThemeSidebarModule, MatRippleModule];

@NgModule({
  imports: [...EXPORT_IMPORT, ...NB_MODULES,  ...MODULES],
  exports: [...EXPORT_IMPORT, ...PIPES, ...COMPONENTS],
  declarations: [...COMPONENTS, ...PIPES],
  providers: [
    LanguagesService
  ]
})
export class ThemeModule {
  static forRoot(): ModuleWithProviders<ThemeModule> {
    return {
      ngModule: ThemeModule,
      providers: [
        ...NbThemeModule.forRoot({name: GAUZY_LIGHT.name }, [
          DEFAULT_THEME,
          COSMIC_THEME,
          CORPORATE_THEME,
          DARK_THEME,
          MATERIAL_LIGHT_THEME,
          MATERIAL_DARK_THEME,
          GAUZY_LIGHT,
          GAUZY_DARK
          ],
        ).providers,
        WindowModeBlockScrollService
      ],
    };
  }
}
