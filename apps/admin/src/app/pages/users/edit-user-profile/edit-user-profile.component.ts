import { Location } from '@angular/common';
import {TranslationBaseComponent} from "../../../@shared/language-base";
import {Component, OnDestroy, OnInit} from "@angular/core";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {FormGroup} from "@angular/forms";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {IUser} from "@ever-astrada/common";
import {TranslateService} from "@ngx-translate/core";
import {UsersService} from "../../../@core/data/users.service";
import {filter, tap} from "rxjs/operators";
import {Observable} from "rxjs";

@UntilDestroy({checkProperties: true})
@Component({
  selector: 'ngx-edit-user-profile',
  templateUrl: './edit-user-profile.component.html',
  styleUrls: [
    // '../../../@shared/user/edit-profile-form/edit-profile-form.component.scss',
    './edit-user-profile.component.scss'
  ]
})
export class EditUserProfileComponent
  extends TranslationBaseComponent
  implements OnInit {

  form: FormGroup;
  params: Params
  user$: Observable<IUser>;

  tabs: any[];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly location: Location,
    public override readonly translateService: TranslateService,
    private readonly userService: UsersService
  ) {
    super(translateService);
  }

  ngOnInit() {
    this.route.params
      .pipe(
        filter((params) => !!params),
        tap((params) => this.params = params),
        tap(() => this.loadTabs()),
        tap(() => this.getUserProfile()),
        untilDestroyed(this)
      )
      .subscribe();
  }

  ngAfterViewInit() {
    this._applyTranslationOnTabs();
  }

  goBack() {
    this.location.back();
  }

  getRoute(tab: string): string {
    return `/pages/users/edit/${this.params.id}/${tab}`;
  }

  loadTabs() {
    this.tabs = [
      {
        title: this.getTranslation('USERS_PAGE.EDIT_USER.MAIN'),
        icon: 'person-outline',
        responsive: true,
        route: this.getRoute('')
      },
      {
        title: this.getTranslation(
          'USERS_PAGE.EDIT_USER.USER_ORGANIZATIONS'
        ),
        icon: 'book-open-outline',
        responsive: true,
        route: this.getRoute('organizations')
      }
    ];
  }

  /**
   * GET user profile
   */
  private async getUserProfile() {
    const { id } = this.params;
    this.user$ = this.userService.getUserById(id);
  }

  private _applyTranslationOnTabs() {
    this.translateService.onLangChange
      .pipe(
        tap(() => this.loadTabs()),
        untilDestroyed(this)
      )
      .subscribe();
  }
}
