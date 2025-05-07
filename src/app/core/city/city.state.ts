import { State, Action, StateContext, Selector } from '@ngxs/store';
import { fetchCities } from './city.actions';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface City {
  enName: string;
  heName: string;
  price: number;
}

export interface CityStateModel {
  cities: City[];
}

@State<CityStateModel>({
  name: 'city',
  defaults: {
    cities: [],
  },
})
@Injectable()
export class CityState {
  constructor(private http: HttpClient) {}

  @Selector()
  static cities(state: CityStateModel): City[] {
    return state.cities;
  }

  @Action(fetchCities)
  fetchCities(ctx: StateContext<CityStateModel>) {
    return this.http.get<City[]>('http://localhost:3000/cities').subscribe(res => {
      ctx.patchState({ cities: res });
    });
  }
}
