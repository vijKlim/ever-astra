import 'reflect-metadata';
import { Container, interfaces, ContainerModule } from 'inversify';
import * as _ from 'lodash';
import { ServicesApp } from "./services.app";


const bindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ServicesApp>(ServicesApp).toSelf().inSingletonScope();
});

const container = new Container();

container.load(bindings);

export const servicesContainer = container;
