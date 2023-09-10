import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GauzyButtonActionComponent } from './gauzy-button-action.component';
import { SharedModule } from '../shared.module';
import { NbIconModule, NbButtonModule } from '@nebular/theme';
import { TranslateModule } from '../translate/translate.module';
import {ThemeModule} from "../../@theme/theme.module";



@NgModule({
  declarations: [
    GauzyButtonActionComponent
  ],
  exports:[GauzyButtonActionComponent],
  imports: [
    CommonModule,
    SharedModule,
    ThemeModule,
    NbIconModule,
    NbButtonModule,
    TranslateModule
  ]
})
export class GauzyButtonActionModule { }
