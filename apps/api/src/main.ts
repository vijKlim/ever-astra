import { env } from './env';

// attempt to set memory limit for NodeJS to be greater than default
// (aprox 1.7Gb)
import v8 from 'v8';
console.log('Setting NodeJS Max memory usage limit to ' + env.WEB_MEMORY);
v8.setFlagsFromString('--max_old_space_size=' + env.WEB_MEMORY);

import 'reflect-metadata';
import sourceMapSupport from 'source-map-support';

import {bootstrapNest} from "./nest-bootstrap";


try {
  if (global.v8debug) {
    global.v8debug.Debug.setBreakOnException();
  }

  sourceMapSupport.install();

} catch (err) {
  console.error(err);
}

import { createEverLogger } from './helpers/Log';
import { servicesContainer } from './services/inversify.config';
import { ServicesApp } from './services/services.app';

const log = createEverLogger({ name: 'uncaught' });

process.on('uncaughtException', (err) => {
  try {
    log.error(err, 'Caught exception: ' + err);
  } catch (logWritingErr) {
    try {
      console.error("Can't write to log!!!!!!");
      console.error(logWritingErr);
    } catch (consoleWritingError) {}
  }

  console.error(err);
});

process.on('unhandledRejection', (err, promise) => {
  try {
    log.error(err, 'Uncaught rejection: ' + err);
  } catch (logWritingErr) {
    try {
      console.error("Can't write to log!!!!!!");
      console.error(logWritingErr);
    } catch (consoleWritingError) {}
  }

  console.error(err);
});


(async () => {


  const app = servicesContainer.get<ServicesApp>(ServicesApp);

  await app.start(async () => {

    // bootstrap NestJS modules/controllers/DI/etc
    await bootstrapNest();
  });
})();
