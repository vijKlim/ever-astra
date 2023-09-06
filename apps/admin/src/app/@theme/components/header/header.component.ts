import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NbMediaBreakpointsService, NbMenuItem, NbMenuService, NbSidebarService, NbThemeService} from '@nebular/theme';

import {map, takeUntil, tap} from 'rxjs/operators';
import {debounceTime, filter, Subject} from 'rxjs';
import {untilDestroyed} from "@ngneat/until-destroy";
import {TranslationBaseComponent} from "../../../@shared/language-base";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent extends TranslationBaseComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();

  @Input() position = 'normal';
  user: any;

  createContextMenu: NbMenuItem[];
  supportContextMenu: NbMenuItem[];

  subject$: Subject<any> = new Subject();

  constructor(
    public readonly translate: TranslateService,
    private readonly router: Router,
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private breakpointService: NbMediaBreakpointsService) {
    super(translate);
  }

  ngOnInit() {
    this._loadContextMenus();

    this.menuService
      .onItemClick()
      .pipe(
        filter(({ tag }) => tag === 'create-context-menu'),
        // untilDestroyed(this)
      )
      .subscribe((e) => {
        this.router.navigate([e.item.link], {
          queryParams: {
            openAddDialog: true
          }
        });
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private _loadContextMenus() {
    this.createContextMenu = [
      ...([
        {
          title: this.getTranslation('CONTEXT_MENU.PROPOSAL'),
          icon: 'paper-plane-outline',
          link: 'pages/sales/proposals/register'
        }
      ]),
      ...([
        {
          title: this.getTranslation('CONTEXT_MENU.ADD_EMPLOYEE'),
          icon: 'people-outline',
          link: 'pages/employees'
        }
      ])
    ];
    console.log(this.createContextMenu)
    this.supportContextMenu = [
      {
        title: this.getTranslation('CONTEXT_MENU.CHAT'),
        icon: 'message-square-outline'
      },
      {
        title: this.getTranslation('CONTEXT_MENU.FAQ'),
        icon: 'clipboard-outline'
      },
      {
        title: this.getTranslation('CONTEXT_MENU.HELP'),
        icon: 'question-mark-circle-outline',
        link: 'pages/help'
      },
      {
        title: this.getTranslation('MENU.ABOUT'),
        icon: 'droplet-outline',
        link: 'pages/about'
      }
    ];
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }
}
