import { Component } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { ThemeSelectorComponent } from '../theme-selector.component';

import {Store} from "../../../../../../../@core/data/store.service";

@Component({
	selector: 'gauzy-theme-selector-image',
	templateUrl: './theme-selector-image.component.html',
	styleUrls: ['./theme-selector-image.component.scss']
})
export class ThemeSelectorImageComponent extends ThemeSelectorComponent {
  isOpen: boolean = false;
	constructor(override readonly themeService: NbThemeService, override readonly store: Store) {
		super(themeService, store);
		this.ngOnInit();
	}
}
