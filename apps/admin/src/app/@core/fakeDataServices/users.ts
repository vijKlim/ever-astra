import { Injectable } from '@angular/core';

import {faker} from '@faker-js/faker';

import { environment} from "../../../environments/environment";
import {IUserRegistrationInput, Country} from "@ever-astrada/common";

@Injectable()
export default class FakeDataUsers {
	getUserRegistrationInput(): IUserRegistrationInput {
		return {
			user: {
				firstName: faker.name.firstName(),
				lastName: faker.name.lastName(),
				email: faker.internet.email(),
				phone: faker.phone.number(),
				image: faker.image.avatar(),
				apartment: faker.datatype.number(199).toString(),
				geoLocation: {
					countryId: faker.datatype.number(200) as Country,
					city: faker.address.city(),
					postcode: faker.address.zipCode(),
					notes: faker.lorem.text(),
					streetAddress: faker.address.streetAddress(),
					house: faker.datatype.number(199).toString(),
					loc: {
						type: 'Point',
						coordinates: [
							environment.DEFAULT_LONGITUDE,
							environment.DEFAULT_LATITUDE,
						],
					},
				},
				isBanned: Math.random() < 0.01,
			},
			password: '123456',
		};
	}

}
