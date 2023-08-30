import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {FakeDataModuleGuard} from "./fakeData/fakeData.module.guard";

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'dashboard',
      component: DashboardComponent,
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
    {
      path: 'users',
      loadChildren: () => import('./users/users.module').then(
        (m) => m.UsersModule
      ),
      data: {
        selectors: {
          project: false,
          employee: false,
          date: false
        }
      }
    },
    {
      path: 'customers',
      loadChildren: () =>
        import('./customers/customers.module').then(
          (m) => m.CustomersModule
        ),
    },
    {
      path: 'generate-initial-data',
      loadChildren: () =>
        import('./fakeData/fakeData.module').then(
          (m) => m.FakeDataModule
        ),
      canActivate: [FakeDataModuleGuard],
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
