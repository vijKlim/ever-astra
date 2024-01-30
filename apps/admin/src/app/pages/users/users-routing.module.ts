import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users.component';
import {EditUserProfileComponent} from "./edit-user-profile/edit-user-profile.component";

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
    canActivate: []
  }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class UsersRoutingModule {}
