import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import {
	NbCardModule,
	NbButtonModule,
	NbInputModule,
	NbIconModule,
	NbDialogModule,
	NbTooltipModule,
	NbBadgeModule,
	NbSelectModule,
	NbRouteTabsetModule,
	NbSpinnerModule,
	NbSidebarModule,
	NbLayoutModule,
	NbActionsModule
} from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
// import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgSelectModule } from '@ng-select/ng-select';


import { TranslateModule } from '../../@shared/translate/translate.module';
import { PaginationModule } from '../../@shared/pagination/pagination.module';
import { SharedModule } from '../../@shared/shared.module';
import {TableComponentsModule} from "../../@shared/table-components/table-components.module";
import {CardGridModule} from "../../@shared/card-grid/card-grid.module";
import {Angular2SmartTableModule} from "angular2-smart-table";
import {GauzyButtonActionModule} from "../../@shared/gauzy-button-action/gauzy-button-action.module";
import {HeaderTitleModule} from "../../@shared/components/header-title/header-title.module";
import {DirectivesModule} from "../../@shared/directives/directives.module";

const COMPONENTS = [
	UsersComponent
];

@NgModule({
    imports: [
        TableComponentsModule,
        NbSidebarModule,
        NbLayoutModule,
        UsersRoutingModule,
        NbActionsModule,
        ThemeModule,
        NbCardModule,
        FormsModule,
        ReactiveFormsModule,
        NbButtonModule,
        NbInputModule,
        NbIconModule,
        Angular2SmartTableModule,
        NbDialogModule.forChild(),
        NbTooltipModule,
        NgSelectModule,
        NbSelectModule,
        NbBadgeModule,
        NbRouteTabsetModule,
        TranslateModule,
        NbSpinnerModule,
        HeaderTitleModule,
        GauzyButtonActionModule,
        PaginationModule,
        CardGridModule,
        SharedModule,
        DirectivesModule
    ],
	declarations: [...COMPONENTS],
	providers: [
	]
})
export class UsersModule {}
