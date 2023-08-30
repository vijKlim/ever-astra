import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import {
  NbChatModule,
  NbDatepickerModule,
  NbDialogModule,
  NbMenuModule,
  NbSidebarModule,
  NbToastrModule,
  NbWindowModule,
} from '@nebular/theme';
import {ThemeModule} from "./@theme/theme.module";
import {CoreModule} from "./@core/core.module";
import {APOLLO_OPTIONS, ApolloModule} from "apollo-angular";
import { HttpLink } from 'apollo-angular/http';
import {HttpClient, HttpClientModule, HttpHeaders} from "@angular/common/http";
import {ApolloLink, InMemoryCache} from '@apollo/client/core';
import {environment} from "environments/environment";
import {WebSocketLink} from "@apollo/client/link/ws";
import {getOperationAST} from "graphql/utilities";
import {AppModuleGuard} from "./app.module.guard";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {HttpLoaderFactory} from "./@shared/translate/translate.module";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' }),
    ApolloModule,
    HttpClientModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    NbChatModule.forRoot({
      messageGoogleMapKey: 'AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY',
    }),
    CoreModule.forRoot(),
    ThemeModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory(httpLink: HttpLink) {
        // Create an http link:
        const http = httpLink.create({ uri: environment.GQL_ENDPOINT });
        // Create a WebSocket link:
        const ws: WebSocketLink = new WebSocketLink({
          uri: environment.GQL_SUBSCRIPTIONS_ENDPOINT,
          options: {
            reconnect: true,
            lazy: true,
          },
        });
        const middleware = new ApolloLink((operation, forward) => {
          operation.setContext({
            headers: new HttpHeaders().set(
                'Authorization',
                `Bearer ${localStorage.getItem('token') || null}`,
            ),
          });
          return forward(operation);
        });

        const link = middleware.concat(
            ApolloLink.split(
                (operation) => {
                  const operationAST = getOperationAST(
                      operation.query,
                      operation.operationName
                  );
                  return (
                      !!operationAST &&
                      operationAST.operation === 'subscription'
                  );
                },
                ws,
                http
            )
        );

        return {
          link,
          defaultOptions: {
            watchQuery: {
              fetchPolicy: 'network-only',
              errorPolicy: 'ignore',
            },
            query: {
              fetchPolicy: 'network-only',
              errorPolicy: 'all',
            },
            mutate: {
              errorPolicy: 'all',
            },
          },
          cache: new InMemoryCache(),
        };
      },
      deps: [HttpLink],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
