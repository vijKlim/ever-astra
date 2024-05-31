import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';
import {firstValueFrom, Observable} from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { TranslationBaseComponent } from '../../../../@shared/language-base';
import {UsersService} from "../../../../@core/data/users.service";
import {IUser} from "@ever-astrada/common";

@UntilDestroy({ checkProperties: true })
@Component({
	selector: 'ngx-edit-user-data',
	templateUrl: './edit-user-data.component.html',
	styleUrls: ['./edit-user-data.component.scss']
})
export class EditUserDataComponent
	extends TranslationBaseComponent
	implements OnInit {

	params: Params;
  user$: Observable<IUser>;

	constructor(
		private readonly route: ActivatedRoute,
		public override readonly translateService: TranslateService,
		private readonly router: Router,
		private readonly usersService: UsersService
	) {
		super(translateService);
	}

	ngOnInit() {
		this.route.params
			.pipe(
				filter((params) => !!params),
				tap((params) => this.params = params),
				tap(() => this.getUserProfile()),
				untilDestroyed(this)
			)
			.subscribe();
	}

	goBack() {
		this.router.navigate(['/pages/users']);
	}

	private async getUserProfile() {
		const { id } = this.params;
		// const user = await this.usersService.getUserById(id);

		// if (user.role.name === RolesEnum.SUPER_ADMIN) {
		// 	/**
		// 	 * Redirect If Edit Super Admin Without Permission
		// 	 */
		// 	const hasSuperAdminRole = await firstValueFrom(
		// 		this.authService.hasRole([RolesEnum.SUPER_ADMIN])
		// 	);
		// 	if (!hasSuperAdminRole) {
		// 		this.router.navigate(['/pages/users']);
		// 		return;
		// 	}
		// }
		// this.user = user;

		this.user$ = await this.usersService.getUserById(id);
	}

}
