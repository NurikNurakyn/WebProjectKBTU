import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SiteHeaderComponent } from '../../components/site-header/site-header';

import { ApiErrorResponse, Mountain } from '../../interfaces/api';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-catalog',
  imports: [FormsModule, RouterLink, SiteHeaderComponent],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class Catalog {
  apiMountains: Mountain[] = [];
  isLoadingApiMountains = false;
  apiErrorMessage = '';

  searchQuery = '';
  selectedDifficulty: 'all' | 'beginner' | 'intermediate' | 'advanced' | 'expert' = 'all';
  minElevation: number | null = null;
  maxElevation: number | null = null;
  isRankModalOpen = false;

  readonly difficultyFilters = [
    { value: 'all', label: 'All difficulties' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' },
  ] as const;

  get filteredMountains(): Mountain[] {
    const normalizedQuery = this.searchQuery.trim().toLowerCase();

    return this.apiMountains.filter((mountain) => {
      const matchesName = !normalizedQuery || mountain.name.toLowerCase().includes(normalizedQuery);
      const matchesDifficulty =
        this.selectedDifficulty === 'all' || mountain.difficulty === this.selectedDifficulty;
      const matchesMinElevation = this.minElevation === null || mountain.elevation_m >= this.minElevation;
      const matchesMaxElevation = this.maxElevation === null || mountain.elevation_m <= this.maxElevation;

      return matchesName && matchesDifficulty && matchesMinElevation && matchesMaxElevation;
    });
  }

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

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedDifficulty = 'all';
    this.minElevation = null;
    this.maxElevation = null;
  }

  openRankModal(): void {
    this.isRankModalOpen = true;
  }

  closeRankModal(): void {
    this.isRankModalOpen = false;
  }
}
