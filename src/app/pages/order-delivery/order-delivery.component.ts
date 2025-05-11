import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule, Router } from '@angular/router';
import { CityState } from '../../core/city/city.state';
import { TimeState } from '../../core/time/time.state';
import { Store } from '@ngxs/store';
import { fetchCities } from '../../core/city/city.actions';
import { fetchTimes } from '../../core/time/time.actions';
import { AuthState } from '../../core/auth/auth.state';
import { HttpClient } from '@angular/common/http';
import { CityFormatPipe } from '../../shared/pipes/city-format.pipe';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-order-delivery',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CityFormatPipe
  ],
  templateUrl: './order-delivery.component.html',
  styleUrls: ['./order-delivery.component.scss']
})
export class OrderDeliveryComponent {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private langService = inject(LanguageService);

  lang = this.langService.lang;
  dir = this.langService.dir;
  toggleLang = () => this.langService.toggle();

  form = this.fb.group({
    senderName: ['', Validators.required],
    senderPhone: ['', [Validators.required, Validators.pattern(/^05\d{8}$/)]],
    pickupAddress: ['', Validators.required],
    pickupCity: ['', Validators.required],
    receiverName: ['', Validators.required],
    receiverPhone: ['', [Validators.required, Validators.pattern(/^05\d{8}$/)]],
    dropOffAddress: ['', Validators.required],
    dropOffCity: ['', Validators.required],
    deliveryDate: [null, Validators.required],
    deliveryTime: ['', Validators.required],
  });

  cities = signal<{ price: number; enName: string; heName: string }[]>([]);
  times = signal<{ day: string; times: string[] }[]>([]);
  today = new Date();

  deliveryDateSignal = signal<Date | null>(null);
  pickupCitySignal = signal<string | null>(null);
  dropOffCitySignal = signal<string | null>(null);

  private getPrice = (city: string): number =>
    this.cities().find(c => c.enName === city)?.price || 0;

  timeMap = computed(() => {
    const map = new Map<string, string[]>();
    for (const slot of this.times()) {
      map.set(slot.day, slot.times);
    }
    return map;
  });

  filteredTimes = computed(() => {
    const raw = this.deliveryDateSignal();
    const date = typeof raw === 'object' && raw !== null && 'toLocaleDateString' in raw
      ? raw as Date
      : null;

    if (date) {
      const day = date.toLocaleDateString('en-US', { weekday: 'short' });
      return this.timeMap().get(day) || [];
    } else {
      return [];
    }
  });

  dateFilter = (d: Date | null): boolean => {
    if (!d) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(d);
    selected.setHours(0, 0, 0, 0);
    console.log('selectedselected', selected);
    console.log('todaytodaytoday', today)
    if (selected < today) return false;

    const day = selected.toLocaleDateString('en-US', { weekday: 'short' });
    return (this.timeMap().get(day)?.length || 0) > 0;
  };

  price = computed(() => {
    const pickup = this.pickupCitySignal();
    const dropoff = this.dropOffCitySignal();

    if (!pickup || !dropoff) return 0;

    const base = pickup === dropoff
      ? this.getPrice(pickup)
      : this.getPrice(pickup) + this.getPrice(dropoff) + 10;

    return +(base * 1.17).toFixed(2);
  });

  constructor() {
    this.store.dispatch([new fetchCities(), new fetchTimes()]);

    this.store.select(CityState.cities).subscribe(cities => this.cities.set(cities));
    this.store.select(TimeState.times).subscribe(times => this.times.set(times));

    this.form.get('deliveryDate')?.valueChanges.subscribe(date => {
      this.deliveryDateSignal.set(date);
    });
    this.form.get('pickupCity')?.valueChanges.subscribe(val => {
      this.pickupCitySignal.set(val);
    });
    this.form.get('dropOffCity')?.valueChanges.subscribe(val => {
      this.dropOffCitySignal.set(val);
    });

    effect(() => {
      const timeList = this.filteredTimes();
      const selected = this.form.controls.deliveryTime.value;
      if (selected && !timeList.includes(selected)) {
        this.form.controls.deliveryTime.reset();
      }
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    const token = this.store.selectSnapshot(AuthState.token);
    if (!token) {
      this.snackBar.open('Not authenticated', 'Close');
      this.router.navigate(['/login']);
      return;
    }

    const payload = {
      ...this.form.value,
      token,
    };

    this.http.post('http://localhost:3000/submit', payload).subscribe({
      next: () => {
        this.snackBar.open('Order submitted!', 'Close', { duration: 3000 });
        this.form.reset();
        this.deliveryDateSignal.set(null);
        this.pickupCitySignal.set(null);
        this.dropOffCitySignal.set(null);
      },
      error: () => {
        this.snackBar.open('Submission failed', 'Close', { duration: 3000 });
      },
    });
  }
}
