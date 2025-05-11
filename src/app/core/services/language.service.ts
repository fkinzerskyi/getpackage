import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  lang = signal<'en' | 'he'>('en');
  dir = computed(() => this.lang() === 'he' ? 'rtl' : 'ltr');

  toggle() {
    this.lang.set(this.lang() === 'en' ? 'he' : 'en');
  }
}
