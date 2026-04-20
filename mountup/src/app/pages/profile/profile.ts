import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SiteHeaderComponent } from '../../components/site-header/site-header';
import { ApiErrorResponse, Ascent, ProfileResponse } from '../../interfaces/api';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, SiteHeaderComponent],
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

  get levelTierClass(): string {
    const level = this.apiProfile?.level ?? 1;
    if (level >= 20) {
      return 'profile-tier--sovereign';
    }
    if (level >= 15) {
      return 'profile-tier--master';
    }
    if (level >= 10) {
      return 'profile-tier--pro';
    }
    if (level >= 5) {
      return 'profile-tier--amateur';
    }
    return 'profile-tier--novice';
  }

  get levelFlavorTitle(): string {
    const level = this.apiProfile?.level ?? 1;
    if (level >= 20) {
      return 'Sky Sovereign Aura';
    }
    if (level >= 15) {
      return 'Master Alpinist Momentum';
    }
    if (level >= 10) {
      return 'Pro Climber Trajectory';
    }
    if (level >= 5) {
      return 'Amateur Growth Arc';
    }
    return 'Novice Base Camp';
  }

  get levelFlavorHint(): string {
    const level = this.apiProfile?.level ?? 1;
    if (level >= 20) {
      return 'Your profile now represents elite expedition consistency.';
    }
    if (level >= 15) {
      return 'You are operating at high-altitude mastery pace.';
    }
    if (level >= 10) {
      return 'Your climbing profile is now in advanced progression mode.';
    }
    if (level >= 5) {
      return 'Momentum is visible. Keep stacking clean ascents.';
    }
    return 'Build your first streak and unlock stronger tiers.';
  }

  get xpToNextLevel(): number {
    if (!this.apiProfile) {
      return 0;
    }

    const nextLevelThreshold = this.apiProfile.level * 500;
    return Math.max(nextLevelThreshold - this.apiProfile.experience_points, 0);
  }

  get levelProgressPercent(): number {
    if (!this.apiProfile) {
      return 0;
    }

    const currentLevelStart = (this.apiProfile.level - 1) * 500;
    const progressInsideLevel = this.apiProfile.experience_points - currentLevelStart;
    return Math.min(Math.max((progressInsideLevel / 500) * 100, 0), 100);
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
