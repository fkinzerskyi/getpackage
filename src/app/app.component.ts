import {Component, inject} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { signal, computed } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {LanguageService} from './core/services/language.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatButtonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'getpackage';

  private langService = inject(LanguageService);
  lang = this.langService.lang;
  dir = this.langService.dir;

  toggleLang = () => this.langService.toggle();
}
