import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { SiteHeaderComponent } from '../../components/site-header/site-header';
import { ApiErrorResponse, MountainDetailResponse } from '../../interfaces/api';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-mountain-detail',
  imports: [CommonModule, RouterLink, SiteHeaderComponent],
  templateUrl: './mountain-detail.html',
  styleUrl: './mountain-detail.css',
})
export class MountainDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly apiService = inject(ApiService);

  mountain: MountainDetailResponse | null = null;
  isLoading = false;
  errorMessage = '';
  isSafetyModalOpen = false;

  constructor() {
    this.loadMountain();
  }

  private loadMountain(): void {
    const mountainIdRaw = this.route.snapshot.paramMap.get('id');
    const mountainId = Number(mountainIdRaw);

    if (!mountainIdRaw || Number.isNaN(mountainId)) {
      this.errorMessage = 'Mountain not found.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.apiService.getMountainById(mountainId).subscribe({
      next: (mountain) => {
        this.mountain = mountain;
        this.isLoading = false;
      },
      error: (error: { error?: ApiErrorResponse }) => {
        this.errorMessage =
          error.error?.detail || error.error?.error || 'Failed to load mountain details.';
        this.isLoading = false;
      },
    });
  }

  openSafetyModal(): void {
    this.isSafetyModalOpen = true;
  }

  closeSafetyModal(): void {
    this.isSafetyModalOpen = false;
  }
}
