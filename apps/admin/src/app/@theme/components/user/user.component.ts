import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {IUser} from "@ever-astrada/common";
import { filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
	selector: 'gauzy-user',
	templateUrl: './user.component.html',
	styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
	@Input() showIdentity = false;
	@Input() user$: Observable<IUser>;

	@Output() clicked: EventEmitter<any> = new EventEmitter<boolean>();

  online$: Observable<boolean>;

	constructor() { }

	ngOnInit(): void {
		this.online$ = this.user$.pipe(
			// filter((user: IUser) => !!user && !!user.employee),
			filter((user: IUser) => true),
			map(
				(user: IUser) =>
					true // user?.employee?.isOnline && !user?.employee?.isAway
			)
		);
	}

	onClicked() {
		this.clicked.emit();
	}
}
