import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ApiErrorResponse } from '../../interfaces/api';
import { SiteHeaderComponent } from '../../components/site-header/site-header';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [RouterLink, FormsModule, SiteHeaderComponent],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  fullName = '';
  email = '';
  username = '';
  password = '';
  country = '';
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(private readonly authService: AuthService) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.isSubmitting = true;

    this.authService
      .register({
        full_name: this.fullName,
        email: this.email,
        username: this.username,
        password: this.password,
        country: this.country,
      })
      .subscribe({
        next: () => {
          this.successMessage = 'Registration successful. You can now log in.';
          this.isSubmitting = false;
          this.fullName = '';
          this.email = '';
          this.username = '';
          this.password = '';
          this.country = '';
        },
        error: (error: { error?: ApiErrorResponse }) => {
          this.errorMessage =
            error.error?.error || error.error?.detail || 'Registration failed. Try again.';
          this.isSubmitting = false;
        },
      });
  }
}
