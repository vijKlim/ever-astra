import {
	Component,
	OnInit,
	Input,
	Output,
	EventEmitter
} from '@angular/core';
import {
	FormBuilder,
	FormGroup,
	Validators
} from '@angular/forms';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Subject, firstValueFrom } from 'rxjs';
import { debounceTime, filter, tap } from 'rxjs/operators';
import {
  ErrorHandlingService,
  ToastrService
} from '../../../@core/services';
import { MatchValidator } from '../../../@core/validators';
import { FormHelpers } from '../../forms/helpers';
import {IImageAsset, IUser, IUserUpdateInput} from "@ever-astrada/common";
import {UsersService} from "../../../@core/data/users.service";

@UntilDestroy({ checkProperties: true })
@Component({
	selector: 'ngx-profile',
	templateUrl: './edit-profile-form.component.html',
	styleUrls: ['./edit-profile-form.component.scss']
})
export class EditProfileFormComponent
	implements OnInit {

	FormHelpers: typeof FormHelpers = FormHelpers;

	hoverState: boolean;
	loading: boolean;

	user: IUser;

	user$: Subject<any> = new Subject();

	/*
	* Getter & Setter for selected user
	*/
	_selectedUser: IUser;
	get selectedUser(): IUser {
		return this._selectedUser;
	}
	@Input() set selectedUser(value: IUser) {
		this._selectedUser = value;
	}


	@Output()
	userSubmitted = new EventEmitter<void>();

	public form: FormGroup = EditProfileFormComponent.buildForm(this.fb);
	static buildForm(fb: FormBuilder): FormGroup {
		return fb.group({
			firstName: [],
			lastName: [],
			email: [null, Validators.required],
			imageUrl: [
				{ value: null, disabled: true }
			],
			imageId: [],
			password: [],
			repeatPassword: [],
			role: [],
			tags: [],
			preferredLanguage: [],
			timeZone: [],
			phoneNumber: []
		}, {
			validators: [
				MatchValidator.mustMatch(
					'password',
					'repeatPassword'
				)
			]
		});
	}

	constructor(
		private readonly fb: FormBuilder,
		private readonly userService: UsersService,
		private readonly store: Store,
		private readonly toastrService: ToastrService,
		private readonly errorHandler: ErrorHandlingService
	) { }

	async ngOnInit() {
		this.user$
			.pipe(
				debounceTime(100),
				tap(() => this.getUserProfile()),
				untilDestroyed(this)
			)
			.subscribe();
		this.store.user$
			.pipe(
				filter((user: IUser) => !!user),
				tap((user: IUser) => (this.user = user)),
				tap(() => this.user$.next(true)),
				untilDestroyed(this)
			)
			.subscribe();
	}


	async getUserProfile() {
		try {
			const { id: userId } = this.selectedUser || this.user;
			const user = await this.userService.getUserById(userId);

			this._patchForm({ ...user });
		} catch (error) {
			this.errorHandler.handleError(error);
		}
	}

	handleImageUploadError(error: any) {
		this.toastrService.danger(error);
	}

	async updateImageAsset(image: IImageAsset) {
		this.store.user = {
			...this.store.user,
			imageId: image.id
		}

		let request: IUserUpdateInput = {
			imageId: image.id
		};

		try {
			await this.userService.update(
				this.selectedUser ? this.selectedUser.id : this.store.userId,
				request
			)
				.then((res: IUser) => {
					try {
						if (res) {
							this.store.user = {
								...this.store.user,
								imageUrl: res.imageUrl
							} as IUser
						}
						this.toastrService.success('TOASTR.MESSAGE.IMAGE_UPDATED');
					} catch (error) {
						console.log('Error while uploading profile avatar', error);
					}
				});
		} catch (error) {
			this.errorHandler.handleError(error);
		}
	}

	async submitForm() {
		const { email, firstName, lastName, preferredLanguage, password, timeZone, phoneNumber } = this.form.getRawValue();
		let request: IUserUpdateInput = {
			email,
			firstName,
			lastName,
			preferredLanguage,
			timeZone,
			phoneNumber
		};

		if (password) {
			request = {
				...request,
				hash: password
			};
		}

		try {
			await this.userService.update(
				this.selectedUser ? this.selectedUser.id : this.store.userId,
				request
			)
				.then(() => {
					if ((this.selectedUser ? this.selectedUser.id : this.store.userId) === this.store.user.id) {
						this.store.user.email = request.email;
					}

					this.toastrService.success('TOASTR.MESSAGE.PROFILE_UPDATED');
					this.userSubmitted.emit();
					/**
					* selectedUser is null for edit profile and populated in User edit
					* Update app language when current user's profile is modified.
					*/
					if (this.selectedUser && this.selectedUser.id !== this.store.userId) { return; }
					this.store.preferredLanguage = preferredLanguage;
				});
		} catch (error) {
			this.errorHandler.handleError(error);
		}
	}

	private _patchForm(user: IUser) {
		if (!user) { return; }

		this.form.patchValue({
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			imageUrl: user.imageUrl,
			imageId: user.imageId,
			phoneNumber: user.phoneNumber
		});

	}
}
