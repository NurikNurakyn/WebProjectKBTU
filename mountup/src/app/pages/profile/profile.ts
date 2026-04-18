import { Component } from '@angular/core';

import { SiteHeaderComponent } from '../../components/site-header/site-header';
import { ApiErrorResponse, Ascent, ProfileResponse } from '../../interfaces/api';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-profile',
  imports: [SiteHeaderComponent],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  apiProfile: ProfileResponse | null = null;
  apiAscents: Ascent[] = [];

  isLoadingProfile = false;
  isLoadingAscents = false;
  apiErrorMessage = '';

  constructor(private readonly apiService: ApiService) {
    this.loadProfile();
    this.loadAscents();
  }

  private loadProfile(): void {
    this.apiErrorMessage = '';
    this.isLoadingProfile = true;

    this.apiService.getProfile().subscribe({
      next: (profile) => {
        this.apiProfile = profile;
        this.isLoadingProfile = false;
      },
      error: (error: { error?: ApiErrorResponse }) => {
        this.apiErrorMessage =
          error.error?.detail ||
          error.error?.error ||
          'Failed to load profile. Please log in first.';
        this.isLoadingProfile = false;
      },
    });
  }

  private loadAscents(): void {
    this.isLoadingAscents = true;

    this.apiService.getAscents().subscribe({
      next: (ascents) => {
        this.apiAscents = ascents;
        this.isLoadingAscents = false;
      },
      error: () => {
        this.isLoadingAscents = false;
      },
    });
  }
}
