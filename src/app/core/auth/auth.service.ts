import { Injectable, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { CookieService } from 'ngx-cookie-service';
import { SetToken } from './auth.actions';
import { AuthState } from './auth.state';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly store = inject(Store);
  private readonly cookie = inject(CookieService);

  constructor() {
    const stored = this.cookie.get('token');
    if (stored) {
      this.store.dispatch(new SetToken(stored));
    }
  }

  setToken(token: string) {
    this.cookie.set('token', token);
    this.store.dispatch(new SetToken(token));
  }

  getToken(): string | null {
    return this.store.selectSnapshot(AuthState.token);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
