import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, share } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {Admin} from "@ever-astrada/common";

@Injectable()
export class AdminsService {
	constructor(private readonly _apollo: Apollo) {}

	getAdmin(id: string): Observable<Admin> {
		return this._apollo
			.watchQuery<{ admin: Admin }>({
				query: gql`
					query admin($id: String!) {
						admin(id: $id) {
							id
							name
							email
							pictureUrl
							firstName
							lastName
						}
					}
				`,
				variables: { id },
				pollInterval: 2000,
			})
			.valueChanges.pipe(
				map((res) => res.data['admin']),
				share()
			);
	}

	updatePassword(
		id: string,
		password: { new: string; current: string }
	): Observable<any> {
		return this._apollo.mutate({
			mutation: gql`
				mutation UpdateAdminPassword(
					$id: String!
					$password: AdminPasswordUpdateInput!
				) {
					updateAdminPassword(id: $id, password: $password)
				}
			`,
			variables: { id, password },
		});
	}

}
