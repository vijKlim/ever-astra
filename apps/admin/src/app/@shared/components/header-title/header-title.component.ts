import {
	Component
} from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';



@UntilDestroy({ checkProperties: true })
@Component({
	selector: 'ngx-header-title',
	templateUrl: './header-title.component.html',
	styles: [
		`
			.name, .org-name {
				font-size: 24px;
				font-weight: 400;
				line-height: 30px;
				letter-spacing: 0em;
				text-align: left;
			}
			:host {
				font-size: 24px;
				font-weight: 600;
				line-height: 30px;
				letter-spacing: 0em;
				text-align: left;
			}
		`
	]
})
export class HeaderTitleComponent  {
}
