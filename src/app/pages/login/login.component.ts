import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../core/auth/auth.service';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
  ],
  providers: [CookieService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hidePassword = signal(true);
  isLoading = signal(false);

  private auth = inject(AuthService);
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private langService = inject(LanguageService);

  lang = this.langService.lang;
  dir = this.langService.dir;

  constructor(private cookieService: CookieService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/create']);
    }
  }

  togglePasswordVisibility() {
    this.hidePassword.update(value => !value);
  }

  submit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    const { email, password } = this.loginForm.value;

    this.http
      .post<{ token: string }>('http://localhost:3000/login', {
        email,
        password,
      })
      .subscribe({
        next: (res) => {
          this.cookieService.set('token', res.token);
          this.auth.setToken(res.token);
          this.snackBar.open(
            this.lang() === 'en' ? 'Login successful!' : 'התחברות הצליחה',
            'Close',
            { duration: 3000 }
          );
          this.router.navigateByUrl('/create').finally(() => {
            this.isLoading.set(false);
          });
        },
        error: () => {
          this.snackBar.open(
            this.lang() === 'en' ? 'Wrong email or password' : 'אימייל או סיסמה שגויים',
            'Close',
            { duration: 3000 }
          );
          this.isLoading.set(false);
        },
      });
  }
}
