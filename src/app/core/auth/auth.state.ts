import { State, Action, StateContext, Selector } from '@ngxs/store';
import { SetToken } from './auth.actions';

export interface AuthStateModel {
  token: string | null;
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    token: null,
  },
})
export class AuthState {
  @Selector()
  static token(state: AuthStateModel): string | null {
    return state.token;
  }

  @Selector()
  static isLoggedIn(state: AuthStateModel): boolean {
    return !!state.token;
  }

  @Action(SetToken)
  setToken(ctx: StateContext<AuthStateModel>, action: SetToken) {
    ctx.patchState({ token: action.token });
  }
}
