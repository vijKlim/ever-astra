import {MiddlewareConsumer, Module, NestModule, OnModuleInit} from '@nestjs/common';
import fs from "fs";
import {TypeOrmModule, TypeOrmModuleOptions} from "@nestjs/typeorm";
import {ServicesApp} from "./services/services.app";
import {env} from "./env";
import {ServicesModule} from "./services/services.module";

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
      // configure TypeORM Connection which will be possible to use inside NestJS (e.g. resolvers)
      TypeOrmModule.forRoot(connectionSettings),
  ],
  controllers: [],
  providers: [],
})
export class ApplicationModule implements NestModule, OnModuleInit {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  configure(consumer: MiddlewareConsumer): any {
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onModuleInit(): any {
  }

}
