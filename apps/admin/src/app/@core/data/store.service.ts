import {Admin, ComponentLayoutStyleEnum, ILanguage, IUser, LanguagesEnum, PermissionsEnum, User} from "@ever-astrada/common";
import {Injectable} from "@angular/core";
import {StoreConfig, Store as AkitaStore, Query} from "@datorama/akita";
import {ComponentEnum, SYSTEM_DEFAULT_LAYOUT} from "../constants";
import {map, merge, Subject} from "rxjs";

export interface AppState
{
  user: IUser;
  systemLanguages: ILanguage[];
  fakeDataGenerator: string
}

export interface PersistState
{
  token: string;
  refresh_token: string;
  userId: string;
  serverConnection: string;
  preferredLanguage: LanguagesEnum;
  preferredComponentLayout: ComponentLayoutStyleEnum;
  componentLayout: any[]; //This would be a Map but since Maps can't be serialized/deserialized it is stored as an array
  themeName: string;
  maintenanceMode: string;
}

export function createInitialAppState(): AppState
{
  return {} as AppState;
}

export function createInitialPersistState(): PersistState
{
  const token = localStorage.getItem('token') || null;
  const refresh_token = localStorage.getItem('refresh_token') || null;
  const userId = localStorage.getItem('_userId') || null;

  const serverConnection = localStorage.getItem('serverConnection') || null;
  const maintenanceMode = localStorage.getItem('maintenanceMode') || null;
  const preferredLanguage = localStorage.getItem('preferredLanguage') || null;
  const componentLayout = localStorage.getItem('componentLayout') || [];
  const themeName = localStorage.getItem('themeName') || null;

  return {
    token,
    refresh_token,
    userId,
    serverConnection,
    preferredLanguage,
    componentLayout,
    themeName,
    maintenanceMode
  } as PersistState;
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'app' })
export class AppStore extends AkitaStore<AppState> {
  constructor()
  {
    super(createInitialAppState());
  }
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'persist' })
export class PersistStore extends AkitaStore<PersistState> {
  constructor()
  {
    super(createInitialPersistState());
  }
}

@Injectable({ providedIn: 'root' })
export class AppQuery extends Query<AppState> {
  constructor(protected override readonly store: AppStore)
  {
    super(store);
  }
}

@Injectable({ providedIn: 'root' })
export class PersistQuery extends Query<PersistState> {
  constructor(protected override readonly store: PersistStore)
  {
    super(store);
  }
}


@Injectable({ providedIn: 'root' })
export class Store
{
  constructor(
    protected readonly appStore: AppStore,
    protected readonly appQuery: AppQuery,
    protected readonly persistStore: PersistStore,
    protected readonly persistQuery: PersistQuery
  ) { }

  user$ = this.appQuery.select((state) => state.user);
  preferredLanguage$ = this.persistQuery.select(
    (state) => state.preferredLanguage
  );
  preferredComponentLayout$ = this.persistQuery.select(
    (state) => state.preferredComponentLayout
  );
  componentLayoutMap$ = this.persistQuery
    .select((state) => state.componentLayout)
    .pipe(map((componentLayout) => new Map(componentLayout)));
  systemLanguages$ = this.appQuery.select((state) => state.systemLanguages);

  subject = new Subject<ComponentEnum>();

  /**
   * Observe any change to the component layout.
   * Returns the layout for the component given in the params in the following order of preference
   * 1. If overridden at component level, return that.
   * Else
   * 2. If preferred layout set, then return that
   * Else
   * 3. Return the system default layout
   */
  componentLayout$(component: ComponentEnum)
  {
    return merge(
      this.persistQuery
        .select((state) => state.preferredComponentLayout)
        .pipe(
          map((preferredLayout) =>
          {
            const dataLayout =
              this.getLayoutForComponent(component);
            return (
              dataLayout ||
              preferredLayout ||
              SYSTEM_DEFAULT_LAYOUT
            );
          })
        ),
      this.persistQuery
        .select((state) => state.componentLayout)
        .pipe(
          map((componentLayout) =>
          {
            const componentMap = new Map(componentLayout);
            return (
              componentMap.get(component) ||
              this.preferredComponentLayout ||
              SYSTEM_DEFAULT_LAYOUT
            );
          })
        )
    );
  }


  set systemLanguages(languages: ILanguage[])
  {
    this.appStore.update({
      systemLanguages: languages
    });
  }

  get systemLanguages(): ILanguage[]
  {
    const { systemLanguages } = this.appQuery.getValue();
    return systemLanguages;
  }

  get refresh_token(): string | null
  {
    const { refresh_token } = this.persistQuery.getValue();
    return refresh_token;
  }

  set refresh_token(refresh_token: string)
  {
    this.persistStore.update({
      refresh_token: refresh_token
    });
  }

  get token(): string | null
  {
    const { token } = this.persistQuery.getValue();
    return token;
  }

  set token(token: string)
  {
    this.persistStore.update({
      token: token
    });
  }

  get adminId(): Admin['id'] | null {
      return localStorage.getItem('_adminId') || null;
  }

  set adminId(id: Admin['id'] | null) {
      if (id == null) {
          localStorage.removeItem('_adminId');
      } else {
          localStorage.setItem('_adminId', id);
      }
  }

  get userId(): User['id'] | null
  {
    const { userId } = this.persistQuery.getValue();
    return userId;
  }

  set userId(id: User['id'] | null)
  {
    this.persistStore.update({
      userId: id
    });
  }

  get user(): IUser
  {
    const { user } = this.appQuery.getValue();
    return user;
  }

  set user(user: IUser)
  {
    this.appStore.update({
      user: user
    });
  }

  hasPermission(permission: PermissionsEnum)
  {
    return true;
  }




  get serverConnection()
  {
    const { serverConnection } = this.persistQuery.getValue();
    return serverConnection;
  }

  set serverConnection(val: string)
  {
    this.persistStore.update({
      serverConnection: val
    });
  }

  get preferredLanguage(): any | null
  {
    const { preferredLanguage } = this.persistQuery.getValue();
    return preferredLanguage;
  }

  set preferredLanguage(preferredLanguage)
  {
    this.persistStore.update({
      preferredLanguage: preferredLanguage
    });
  }

  get preferredComponentLayout(): any | null
  {
    const { preferredComponentLayout } = this.persistQuery.getValue();
    return preferredComponentLayout;
  }

  set preferredComponentLayout(preferredComponentLayout)
  {
    this.persistStore.update({
      preferredComponentLayout: preferredComponentLayout
    });
  }

  clear()
  {
    this.appStore.reset();
    this.persistStore.reset();
  }

  getLayoutForComponent(
    componentName: ComponentEnum
  ): ComponentLayoutStyleEnum
  {
    const { componentLayout } = this.persistQuery.getValue();
    const componentLayoutMap = new Map(componentLayout);
    return componentLayoutMap.get(
      componentName
    ) as ComponentLayoutStyleEnum;
  }

  setLayoutForComponent(
    componentName: ComponentEnum,
    style: ComponentLayoutStyleEnum
  )
  {
    const { componentLayout } = this.persistQuery.getValue();
    const componentLayoutMap = new Map(componentLayout);
    componentLayoutMap.set(componentName, style);
    const componentLayoutArray = Array.from(
      componentLayoutMap.entries()
    ) as any;
    this.persistStore.update({
      componentLayout: componentLayoutArray
    });
  }

  set componentLayout(componentLayout: any[])
  {
    this.persistStore.update({
      componentLayout
    });
  }

  get currentTheme(): string | null
  {
    const { themeName } = this.persistQuery.getValue();
    return themeName;
  }

  set currentTheme(name: string)
  {
    this.persistStore.update({
      themeName: name
    })
  }

  get maintenanceMode(): string | null {
      const { maintenanceMode } = this.persistQuery.getValue();
      return maintenanceMode;
  }

  get fakeDataGenerator(): string | null {
      const { fakeDataGenerator } = this.appQuery.getValue();
      return fakeDataGenerator;
  }

  set fakeDataGenerator(val: string) {
    this.appStore.update({
      fakeDataGenerator: val
    })
  }
}
