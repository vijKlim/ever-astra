import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import {environment} from "environments/environment";
import {enableProdMode} from "@angular/core";
import {akitaConfig, enableAkitaProdMode, persistState} from "@datorama/akita";

if (environment.production) {
  enableProdMode();
  enableAkitaProdMode();
}

persistState({
  key: '_gauzyStore'
});

akitaConfig({
  resettable: true
});

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
