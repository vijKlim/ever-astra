import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users.component';
import {EditUserProfileComponent} from "./edit-user-profile/edit-user-profile.component";
import {EditUserDataComponent} from "./edit-user-profile/edit-user-data/edit-user-data.component";

export function redirectTo() {
	return '/pages/dashboard';
}

const routes: Routes = [
	{
		path: '',
		component: UsersComponent,
		canActivate: []
	},
  {
    path: 'edit/:id',
    component: EditUserProfileComponent,
    canActivate: [],
    children: [
      {
        path: '',
        component: EditUserDataComponent
      }
    ]
  }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class UsersRoutingModule {}
