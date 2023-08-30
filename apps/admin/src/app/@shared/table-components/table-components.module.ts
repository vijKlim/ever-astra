import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
	NbIconModule,
	NbTooltipModule,
	NbBadgeModule,
	NbToggleModule
} from '@nebular/theme';
import { TranslateModule } from '../translate/translate.module';
import { SharedModule } from '../shared.module';
import { EmailComponent } from './email/email.component';
import {PictureNameTagsComponent} from "./picture-name-tags/picture-name-tags.component";
import {NotesWithTagsComponent} from "./notes-with-tags/notes-with-tags.component";

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		NbIconModule,
		NbTooltipModule,
		NbBadgeModule,
		TranslateModule,
		SharedModule,
		NbToggleModule
	],
	declarations: [
		EmailComponent,
    PictureNameTagsComponent,
    NotesWithTagsComponent
	],
	exports: [
		EmailComponent,
    PictureNameTagsComponent,
    NotesWithTagsComponent
	],
	providers: []
})
export class TableComponentsModule { }
