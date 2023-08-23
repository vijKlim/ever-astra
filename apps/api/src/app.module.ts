import {MiddlewareConsumer, Module, NestModule, OnModuleInit} from '@nestjs/common';
import fs from "fs";
import {TypeOrmModule, TypeOrmModuleOptions} from "@nestjs/typeorm";
import {ServicesApp} from "./services/services.app";
import {env} from "./env";
import {ServicesModule} from "./services/services.module";
import {ModuleRef} from "@nestjs/core";
import {CommandBus, CqrsModule, EventBus} from "@nestjs/cqrs";
import mongoose from "mongoose";
import {createEverLogger} from "./helpers/Log";
import Logger from "bunyan";
import chalk from "chalk";
import {GraphQLModule} from "@nestjs/graphql";
import {AdminsModule} from "./graphql/admin/admins.module";
import {ApolloDriver} from "@nestjs/apollo";

const port = env.GQLPORT;
const host = env.API_HOST;

const log: Logger = createEverLogger({
  name: 'NestJS ApplicationModule',
});

// Add here all CQRS command handlers
export const CommandHandlers = [];

// Add here all CQRS event handlers
export const EventHandlers = [];

const entities = ServicesApp.getEntities();

const isSSL = process.env.DB_SSL_MODE && process.env.DB_SSL_MODE !== 'false';

// let's temporary save Cert in ./tmp/logs folder because we have write access to it
const sslCertPath = `${env.LOGS_PATH}/ca-certificate.crt`;

if (isSSL) {
  const base64data = process.env.DB_CA_CERT;
  const buff = Buffer.from(base64data, 'base64');
  const sslCert = buff.toString('ascii');
  fs.writeFileSync(sslCertPath, sslCert);
}

// TODO: put to config
const connectTimeoutMS = 40000;


// We creating default connection for TypeORM.
// It might be used in every place where we do not explicitly require connection with some name.
// For example, we are using connection named "typeorm" inside our repositories
const connectionSettings: TypeOrmModuleOptions = {
  // Note: do not change this connection name, it should be default one!
  // TODO: put this into settings (it's mongo only during testing of TypeORM integration!)
  type: 'mongodb',
  url: env.DB_URI,
  ssl: isSSL,
  // sslCA: isSSL ? [sslCertPath] : undefined,
  host: process.env.DB_HOST || 'localhost',
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME || 'ever_development',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 27017,
  entities,
  synchronize: true,
  useNewUrlParser: true,
  // autoReconnect: true,
  // reconnectTries: Number.MAX_VALUE,
  // poolSize: poolSize,
  connectTimeoutMS: connectTimeoutMS,
  logging: true,
  logger: 'file', // Removes console logging, instead logs all queries in a file ormlogs.log
  useUnifiedTopology: true,
};

@Module({
  imports: [
    ServicesModule,
    CqrsModule,
    AdminsModule,
    // configure TypeORM Connection which will be possible to use inside NestJS (e.g. resolvers)
    TypeOrmModule.forRoot(connectionSettings),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      installSubscriptionHandlers: true,
      debug: !env.isProd,
      playground: true,
      context: ({ req, res }) => ({
        req,
      }),

    }),
  ],
  controllers: [],
  providers: [...CommandHandlers, ...EventHandlers],
})
export class ApplicationModule implements NestModule, OnModuleInit {

  constructor(
      private readonly moduleRef: ModuleRef,
      private readonly command$: CommandBus,
      private readonly event$: EventBus
  ) {}

  onModuleInit() {
    // initialize CQRS
    this.event$.register(EventHandlers);
    this.command$.register(CommandHandlers);
  }

  configure(consumer: MiddlewareConsumer): any {

    console.log(chalk.green(`Configuring NestJS ApplicationModule`));

    // trick for GraphQL vs MongoDB ObjectId type.
    // See https://github.com/apollographql/apollo-server/issues/1633 and
    // https://github.com/apollographql/apollo-server/issues/1649#issuecomment-420840287
    const { ObjectId } = mongoose.Types;

    ObjectId.prototype.valueOf = function () {
      return this.toString();
    };

    /* Next is code which could be used to manually create GraphQL Server instead of using GraphQLModule.forRoot(...)

    const schema: GraphQLSchema = this.createSchema();
    const server: ApolloServer = this.createServer(schema);

    // this creates manually GraphQL subscriptions server (over ws connection)
    this.subscriptionsService.createSubscriptionServer(server);

    const app: any = this.httpServerRef;

    const graphqlPath = '/graphql';

    server.applyMiddleware({app, path: graphqlPath});

    */

    log.info(`GraphQL Playground available at http://${host}:${port}/graphql`);
    console.log(chalk.green(`GraphQL Playground available at http://${host}:${port}/graphql`));
  }

}
