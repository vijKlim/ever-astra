import { Component, Input, Output, EventEmitter } from '@angular/core';
import {IUser} from "@ever-astrada/common";
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChange } from "@ever-astrada/common-angular";
import { BehaviorSubject, tap, Observable, filter, firstValueFrom } from 'rxjs';

@UntilDestroy({ checkProperties: true })
@Component({
	selector: 'gauzy-user-menu',
	templateUrl: './user-menu.component.html',
	styleUrls: ['./user-menu.component.scss'],
})
export class UserMenuComponent  {
	private _user$: Observable<IUser>;

	@Output()
	public close: EventEmitter<any> = new EventEmitter<any>(null);

	public clicks: boolean[] = [];

	constructor() {
		this._user$ = new Observable();
	}

	public onClick() {
		this.close.emit();
	}

	public onClickOutside(event: boolean) {
		this.clicks.push(event);
		if (!event && this.clicks.length > 1) this.onClick();
	}

	@Input()
	public set user$(value: Observable<IUser>) {
		if (value) {
			this._user$ = value
		}
	}

	public get user$(): Observable<IUser> {
		return this._user$;
	}
}
