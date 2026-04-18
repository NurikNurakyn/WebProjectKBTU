import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { SiteHeaderComponent } from '../../components/site-header/site-header';
import { ApiErrorResponse, Mountain } from '../../interfaces/api';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-mountain-detail',
  imports: [RouterLink, SiteHeaderComponent],
  templateUrl: './mountain-detail.html',
  styleUrl: './mountain-detail.css',
})
export class MountainDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly apiService = inject(ApiService);

  mountain: Mountain | null = null;
  isLoading = false;
  errorMessage = '';

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
}
