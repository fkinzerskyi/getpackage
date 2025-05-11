import { State, Action, StateContext, Selector } from '@ngxs/store';
import { fetchTimes } from './time.actions';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {tap} from 'rxjs';

export interface TimeSlot {
  day: string;
  times: string[];
}

export interface TimeStateModel {
  times: TimeSlot[];
}

@State<TimeStateModel>({
  name: 'time',
  defaults: {
    times: [],
  },
})
@Injectable()
export class TimeState {
  constructor(private http: HttpClient) {}

  @Selector()
  static times(state: TimeStateModel): TimeSlot[] {
    return state.times;
  }

  @Action(fetchTimes)
  fetchTimes(ctx: StateContext<TimeStateModel>) {
    return this.http.get<TimeSlot[]>('http://localhost:3000/times').pipe(
      tap(res => ctx.patchState({ times: res }))
    );
  }
}
