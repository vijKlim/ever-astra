import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IUser,
  ComponentLayoutStyleEnum,
  IUserViewModel, RolesEnum, User, getCountryName, IUserFindInput,
} from "@ever-astrada/common";
import { NbDialogService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { LocalDataSource, Angular2SmartTableComponent } from 'angular2-smart-table';
import {filter, takeUntil, tap} from 'rxjs/operators';
import {
  debounceTime,
  firstValueFrom,
  Subject,
  of as observableOf,
  map,
  finalize, Observable, forkJoin
} from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChange } from "@ever-astrada/common-angular";
import {
  ToastrService,
} from '../../@core/services';
import { Store } from '../../@core/data/store.service';


import {
  PictureNameTagsComponent,
} from '../../@shared/table-components';
import { ComponentEnum } from '../../@core/constants';
import {
  IPaginationBase,
  PaginationFilterBaseComponent
} from '../../@shared/pagination/pagination-filter-base.component';
import { EmailComponent } from '../../@shared/table-components';
import {UsersService} from "../../@core/data/users.service";
import {UserComponent} from "../../@theme/components/user/user.component";
import {TranslationBaseComponent} from "../../@shared/language-base";

const perPage = 5;

@UntilDestroy({ checkProperties: true })
@Component({
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent extends TranslationBaseComponent implements OnInit, OnDestroy {

  private ngDestroy$ = new Subject<void>();

  static noInfoSign = '';
  public loading: boolean;
  public showBanLoading = false;

  protected users: User[] = [];


  public settingsSmartTable: object;
  public sourceSmartTable = new LocalDataSource();
  selectedUser: IUserViewModel

  userName = 'User';

  private dataCount: number;
  private userFindInput:IUserFindInput;
  private $users;

  public _showOnlyBanned: boolean;

  disableButton = true;

  viewComponentName: ComponentEnum;
  dataLayoutStyle = ComponentLayoutStyleEnum.TABLE;
  componentLayoutStyleEnum = ComponentLayoutStyleEnum;

  constructor(
    private readonly _router: Router,
    private readonly _usersService: UsersService,
    private readonly _translateService: TranslateService,
    private readonly dialogService: NbDialogService
  ) {
    super(_translateService)
    this._loadSettingsSmartTable();
  }

  async ngOnInit() {
    this._applyTranslationOnSmartTable();
    this.smartTableChange();
    this._loadDataSmartTable();
  }

  private _loadSettingsSmartTable() {

    this.settingsSmartTable = {
      actions: false,
      selectMode: 'multi',
      columns: {
        id: {
          title: 'ID'
        },
        name: {
          title: this.getTranslation('SM_TABLE.FULL_NAME'),
          class: 'align-row'
        },
        email: {
          title: this.getTranslation('SM_TABLE.EMAIL'),
          type: 'custom',
          renderComponent: EmailComponent,
          componentInitFunction: EmailComponent.componentInit
        },
        phone: {
          title: this.getTranslation('FORM.LABELS.PHONE_NUMBER'),
        },
        country: {
          title: this.getTranslation('FORM.PLACEHOLDERS.COUNTRY'),
        },
        city: { title: this.getTranslation('FORM.PLACEHOLDERS.CITY'), },
        address: { title: this.getTranslation('FORM.PLACEHOLDERS.ADDRESS') }
      },
      pager: {
        display: true,
        perPage
      },
    };
  }

  private async _loadDataSmartTable(userFindInput?: IUserFindInput, page = 1) {
    if (this.$users) {
      await this.$users.unsubscribe();
    }
    let users: User[] = [];

    const loadData = async () => {
      let usersVM = users.map((user) => {

        return {
          id: user.id,
          name:
            user.firstName && user.lastName
              ? `${user.firstName} ${user.lastName}`
              : user.firstName
                ? user.firstName
                : user.lastName
                  ? user.lastName
                  : user.id,
          email: user.email || UsersComponent.noInfoSign,
          phone: user.phone || UsersComponent.noInfoSign,
          country:
            getCountryName(user.geoLocation.countryId).trim() ||
            UsersComponent.noInfoSign,
          city:
            user.geoLocation.city || UsersComponent.noInfoSign,
          address: `st. ${
            user.geoLocation.streetAddress ||
            UsersComponent.noInfoSign
          }, hse. № ${
            user.geoLocation.house || UsersComponent.noInfoSign
          }`,
          isBanned: user.isBanned,
        };
      });

      await this.loadDataCount(userFindInput);

      if (this.showOnlyBanned) {
        usersVM = usersVM.filter((user) => user.isBanned);
      }

      const usersData = new Array(this.dataCount);
      usersData.fill(usersVM[0], 0, this.dataCount)
      usersData.splice(perPage * (page - 1), perPage, ...usersVM);


       await this.sourceSmartTable.load(usersData);
    };

    // We call two times 'loadData'
    // This is need because in every change on one of them the server emit and we want to receive it
    this.$users = this._usersService
      .getUsers(userFindInput,{
        skip: perPage * (page - 1),
        limit: perPage,
      })
      .pipe(takeUntil(this.ngDestroy$))
      .subscribe(async (u: User[]) => {
        users = u;
        await loadData();
      });
  }

  private _applyTranslationOnSmartTable() {
    this._translateService.onLangChange
      .pipe(takeUntil(this.ngDestroy$))
      .subscribe(() => {
        this._loadSettingsSmartTable();
      });
  }

  private async smartTableChange() {
    this.sourceSmartTable
      .onChanged()
      .pipe(takeUntil(this.ngDestroy$))
      .subscribe(async (event) => {

        if (event.action === 'filter') {
          const initialValue = {};
          this.userFindInput = event.filter.reduce((obj, item) => {
            return {
              ...obj,
              [item['field']]: item['search'],
            };
          }, initialValue) as IUserFindInput;
        }

        if (event.action === 'page' || event.action === 'filter') {
          await this._loadDataSmartTable(this.userFindInput, event.paging.page);
        }
      });
  }

  private async loadDataCount(userFindInput?: IUserFindInput) {
    this.dataCount = await this._usersService.getCountOfUsers(userFindInput);
  }

  public set showOnlyBanned(v: boolean) {
    this._showOnlyBanned = v;
    this._loadDataSmartTable();
  }

  public get showOnlyBanned(): boolean {
    return this._showOnlyBanned;
  }

  ngOnDestroy() {
    this.ngDestroy$.next();
    this.ngDestroy$.complete();
  }

  selectUser({isSelected, data}) {
    this.disableButton = !isSelected;
    this.selectedUser = data;
    if (this.selectedUser) {
      const checkName = data.name.trim();
      this.userName = checkName ? checkName : 'User';
    }
  }

  edit(selectedItem?: IUser) {
    if (selectedItem) {
      this.selectUser({
        isSelected: true,
        data: selectedItem
      });
    }
    this._router.navigate(['/pages/users/edit/' + this.selectedUser.id]);
  }
}
