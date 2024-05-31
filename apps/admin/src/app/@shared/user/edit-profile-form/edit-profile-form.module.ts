import { ThemeModule } from '../../../@theme/theme.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import {
	NbCardModule,
	NbButtonModule,
	NbIconModule,
	NbSelectModule,
	NbInputModule,
	NbBadgeModule,
	NbFormFieldModule
} from '@nebular/theme';
import { EditProfileFormComponent } from './edit-profile-form.component';

import { TranslateModule } from '../../translate/translate.module';
import { SharedModule } from '../../shared.module';
import { TableComponentsModule } from '../../table-components';
import {UsersService} from "../../../@core/data/users.service";


@NgModule({
	imports: [
		FormsModule,
		ReactiveFormsModule,
		NbButtonModule,
		NbCardModule,
		NbIconModule,
		NbInputModule,
		NbSelectModule,
		NbBadgeModule,
		NbFormFieldModule,
		ThemeModule,
		TranslateModule,
		SharedModule,
		TableComponentsModule,

	],
	exports: [EditProfileFormComponent],
	declarations: [EditProfileFormComponent],
	providers: [UsersService]
})
export class EditProfileFormModule { }
