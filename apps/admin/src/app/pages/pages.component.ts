import {Component, OnDestroy, OnInit} from '@angular/core';

import { MENU_ITEMS } from './pages-menu';
import { NbMenuItem } from '@nebular/theme';
import {UntilDestroy} from "@ngneat/until-destroy";
import {TranslationBaseComponent} from "../@shared/language-base";
import {FeatureEnum, IUser, PermissionsEnum} from "@ever-astrada/common";
import {TranslateService} from "@ngx-translate/core";
import {Store} from "../@core/data/store.service";
import {Router} from "@angular/router";
import {UsersService} from "../@core/data/users.service";
import {firstValueFrom, Observable} from "rxjs";
import {AdminsService} from "../@core/data/admins.service";

interface GaMenuItem extends NbMenuItem {
  class?: string;
  data: {
    translationKey: string; //Translation key for the title, mandatory for all items
    permissionKeys?: PermissionsEnum[]; //Check permissions and hide item if any given permission is not present
    featureKey?: FeatureEnum; //Check permissions and hide item if any given permission is not present
    withOrganizationShortcuts?: boolean; //Declare if the sidebar item has organization level shortcuts
    hide?: () => boolean; //Hide the menu item if this returns true
  };
}

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout *ngIf="!!menu && user">
      <ga-sidebar-menu [items]="menu"></ga-sidebar-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent extends TranslationBaseComponent implements OnInit{

  isEmployee: boolean;
  // organization: IOrganization;
  user: IUser;
  menu: NbMenuItem[] = [];

  constructor(
    public readonly translate: TranslateService,
    private readonly store: Store,
    private readonly router: Router,
    private readonly adminsService: AdminsService,
  ) {
    super(translate);
  }

  getMenuItems(): GaMenuItem[] {
    return [
      {
        title: 'Dashboards',
        icon: 'fas fa-th',
        link: '/pages/dashboard',
        pathMatch: 'prefix',
        home: true,
        data: {
          translationKey: 'MENU.DASHBOARDS',
          featureKey: FeatureEnum.FEATURE_DASHBOARD
        }
      },
      {
        title: 'Organization',
        icon: 'fas fa-globe-americas',
        data: {
          translationKey: 'MENU.ORGANIZATION',
          withOrganizationShortcuts: true
        },
        children: [
          {
            title: 'Manage',
            icon: 'fas fa-globe-americas',
            pathMatch: 'prefix',
            data: {
              organizationShortcut: true,
              permissionKeys: [PermissionsEnum.ALL_ORG_EDIT],
              urlPrefix: `/pages/organizations/edit/`,
              urlPostfix: '',
              translationKey: 'MENU.MANAGE',
              featureKey: FeatureEnum.FEATURE_ORGANIZATION
            }
          },
          {
            title: 'Equipment',
            icon: 'fas fa-border-all',
            link: '/pages/organization/equipment',
            data: {
              permissionKeys: [
                PermissionsEnum.ALL_ORG_VIEW,
                PermissionsEnum.ORG_EQUIPMENT_VIEW
              ],
              translationKey: 'MENU.EQUIPMENT',
              featureKey: FeatureEnum.FEATURE_ORGANIZATION_EQUIPMENT,
              add: '/pages/organization/equipment?openAddDialog=true'
            }
          },
          {
            title: 'Inventory',
            icon: 'fas fa-grip-vertical',
            link: '/pages/organization/inventory',
            pathMatch: 'prefix',
            data: {
              translationKey: 'MENU.INVENTORY',
              permissionKeys: [PermissionsEnum.ALL_ORG_VIEW],
              featureKey:
              FeatureEnum.FEATURE_ORGANIZATION_INVENTORY,
              add: '/pages/organization/inventory/create'
            }
          },
          {
            title: 'Tags',
            icon: 'fas fa-tag',
            link: '/pages/organization/tags',
            data: {
              translationKey: 'MENU.TAGS',
              permissionKeys: [
                PermissionsEnum.ALL_ORG_VIEW,
                PermissionsEnum.ORG_TAGS_ADD
              ],
              featureKey: FeatureEnum.FEATURE_ORGANIZATION_TAG,
              add: '/pages/organization/tags?openAddDialog=true'
            }
          },
          {
            title: 'Vendors',
            icon: 'fas fa-truck',
            link: '/pages/organization/vendors',
            data: {
              translationKey: 'ORGANIZATIONS_PAGE.VENDORS',
              permissionKeys: [PermissionsEnum.ALL_ORG_EDIT],
              featureKey: FeatureEnum.FEATURE_ORGANIZATION_VENDOR,
              add: '/pages/organization/vendors?openAddDialog=true'
            }
          },
          {
            title: 'Projects',
            icon: 'fas fa-book',
            link: `/pages/organization/projects`,
            data: {
              translationKey: 'ORGANIZATIONS_PAGE.PROJECTS',
              permissionKeys: [
                PermissionsEnum.ALL_ORG_EDIT,
                PermissionsEnum.ORG_PROJECT_VIEW
              ],
              featureKey:
              FeatureEnum.FEATURE_ORGANIZATION_PROJECT,
              add: '/pages/organization/projects?openAddDialog=true'
            }
          },
          {
            title: 'Departments',
            icon: ' fas fa-briefcase',
            link: `/pages/organization/departments`,
            data: {
              translationKey: 'ORGANIZATIONS_PAGE.DEPARTMENTS',
              permissionKeys: [PermissionsEnum.ALL_ORG_EDIT],
              featureKey:
              FeatureEnum.FEATURE_ORGANIZATION_DEPARTMENT,
              add: '/pages/organization/departments?openAddDialog=true'
            }
          },
          {
            title: 'Teams',
            icon: 'fas fa-user-friends',
            link: `/pages/organization/teams`,
            data: {
              translationKey: 'ORGANIZATIONS_PAGE.EDIT.TEAMS',
              permissionKeys: [
                PermissionsEnum.ALL_ORG_EDIT,
                PermissionsEnum.ORG_TEAM_VIEW
              ],
              featureKey: FeatureEnum.FEATURE_ORGANIZATION_TEAM,
              add: '/pages/organization/teams?openAddDialog=true'
            }
          },
          {
            title: 'Documents',
            icon: 'far fa-file-alt',
            link: `/pages/organization/documents`,
            data: {
              translationKey: 'ORGANIZATIONS_PAGE.DOCUMENTS',
              permissionKeys: [PermissionsEnum.ALL_ORG_EDIT],
              featureKey:
              FeatureEnum.FEATURE_ORGANIZATION_DOCUMENT,
              add: '/pages/organization/documents?openAddDialog=true'
            }
          },
          {
            title: 'Help Center',
            icon: 'far fa-question-circle',
            link: '/pages/organization/help-center',
            data: {
              translationKey: 'ORGANIZATIONS_PAGE.HELP_CENTER',
              featureKey:
              FeatureEnum.FEATURE_ORGANIZATION_HELP_CENTER
            }
          }
        ]
      }
    ];
  }

  async ngOnInit() {
    await this._createEntryPoint();
    this.menu = this.getMenuItems();
  }

  /*
	 * This is app entry point after login
	 */
  private async _createEntryPoint() {
    const id = this.store.adminId;
    if (!id) return;

    const admin = await firstValueFrom(this.adminsService.getAdmin(id));
    this.user = <IUser>{
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      image: admin.pictureUrl,
    };
    this.store.user = this.user;
  }
}
