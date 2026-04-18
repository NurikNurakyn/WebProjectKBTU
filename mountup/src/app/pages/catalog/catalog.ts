import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteHeaderComponent } from '../../components/site-header/site-header';

import { ApiErrorResponse, Mountain } from '../../interfaces/api';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-catalog',
  imports: [RouterLink, SiteHeaderComponent],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class Catalog {
  apiMountains: Mountain[] = [];
  isLoadingApiMountains = false;
  apiErrorMessage = '';

  constructor(private readonly apiService: ApiService) {
    this.loadMountainsFromApi();
  }

  loadMountainsFromApi(): void {
    this.apiErrorMessage = '';
    this.isLoadingApiMountains = true;

    this.apiService.getMountains().subscribe({
      next: (mountains) => {
        this.apiMountains = mountains;
        this.isLoadingApiMountains = false;
      },
      error: (error: { error?: ApiErrorResponse }) => {
        this.apiErrorMessage =
          error.error?.detail || error.error?.error || 'Failed to load mountains from API.';
        this.isLoadingApiMountains = false;
      },
    });
  }
}
