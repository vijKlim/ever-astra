import 'reflect-metadata';
import { Container, interfaces, ContainerModule } from 'inversify';
import * as _ from 'lodash';
import { ServicesApp } from "./services.app";
import {Admin} from "@ever-astrada/common";
import {getConnection, Repository} from "typeorm";
import {AdminsService} from "./admins";
import {ServiceSymbol} from "./IService";
import {IRoutersManager, RoutersManager, RouterSymbol} from "../@pyro/io";
import {AuthService, authServiceFactory} from "./auth";

function getRepository(t: any): any {
  const conn = getConnection('typeorm');
  return conn.getRepository(t);
}


const bindings = new ContainerModule((bind: interfaces.Bind) => {
  // bind<Repository<Admin>>('AdminRepository')
  //   .toDynamicValue(() => {
  //     return getRepository(Admin);
  //   })
  //   .inRequestScope();

  _.each(
    [
      AdminsService
    ],
    (Service: any) => {
      bind(Service).to(Service).inSingletonScope();

      bind<any>(ServiceSymbol).toFactory<any>((context) => {
        return context.container.get<any>(Service);
      });

      bind<any>(RouterSymbol).toFactory<any>((context) => {
        return context.container.get<any>(Service);
      });
    }
  );

  bind(AuthService).toSelf();

  bind('Factory<AuthService>').toFactory(authServiceFactory);

  bind<IRoutersManager>('RoutersManager')
    .to(RoutersManager)
    .inSingletonScope();

	bind<ServicesApp>(ServicesApp).toSelf().inSingletonScope();
});

const container = new Container();

container.load(bindings);

export const servicesContainer = container;
