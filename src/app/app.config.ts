import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideStore, provideStates } from '@ngxs/store';
import { appRoutes } from './app.routes';

import { AuthState } from './core/auth/auth.state';
import { CityState } from './core/city/city.state';
import { TimeState } from './core/time/time.state';
import {withNgxsReduxDevtoolsPlugin} from '@ngxs/devtools-plugin';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withComponentInputBinding()),
    provideHttpClient(),
    provideStore(),
    withNgxsReduxDevtoolsPlugin(),
    provideStates([AuthState, CityState, TimeState]),
  ]
};
