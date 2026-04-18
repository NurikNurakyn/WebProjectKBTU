import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { ApiErrorResponse } from '../../interfaces/api';
import { SiteHeaderComponent } from '../../components/site-header/site-header';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule, SiteHeaderComponent],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  username = '';
  password = '';
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.isSubmitting = true;

    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/profile']);
      },
      error: (error: { error?: ApiErrorResponse }) => {
        this.errorMessage =
          error.error?.error ||
          error.error?.detail ||
          'Login failed. Please check your credentials.';
        this.isSubmitting = false;
      },
    });
  }
}
