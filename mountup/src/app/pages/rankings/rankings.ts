import { Component } from '@angular/core';

import { SiteHeaderComponent } from '../../components/site-header/site-header';
import { ApiErrorResponse, LeaderboardEntry } from '../../interfaces/api';
import { ApiService } from '../../services/api.service';

interface PodiumEntry {
  displayOrder: number;
  rankPosition: number;
  medalClass: 'gold' | 'silver' | 'bronze';
  entry: LeaderboardEntry;
}

@Component({
  selector: 'app-rankings',
  imports: [SiteHeaderComponent],
  templateUrl: './rankings.html',
  styleUrl: './rankings.css',
})
export class Rankings {
  leaderboard: LeaderboardEntry[] = [];
  isLoadingLeaderboard = false;
  apiErrorMessage = '';

  private readonly podiumMapping = [
    { displayOrder: 1, rankPosition: 2, medalClass: 'silver' as const },
    { displayOrder: 2, rankPosition: 1, medalClass: 'gold' as const },
    { displayOrder: 3, rankPosition: 3, medalClass: 'bronze' as const },
  ];

  constructor(private readonly apiService: ApiService) {
    this.loadLeaderboard();
  }

  loadLeaderboard(): void {
    this.apiErrorMessage = '';
    this.isLoadingLeaderboard = true;

    this.apiService.getLeaderboard().subscribe({
      next: (entries) => {
        this.leaderboard = entries;
        this.isLoadingLeaderboard = false;
      },
      error: (error: { error?: ApiErrorResponse }) => {
        this.apiErrorMessage =
          error.error?.detail || error.error?.error || 'Failed to load leaderboard from API.';
        this.isLoadingLeaderboard = false;
      },
    });
  }

  get podiumEntries(): PodiumEntry[] {
    return this.podiumMapping
      .map((slot) => {
        const rankedEntry = this.leaderboard[slot.rankPosition - 1];
        if (!rankedEntry) {
          return null;
        }

        return {
          ...slot,
          entry: rankedEntry,
        };
      })
      .filter((slot): slot is PodiumEntry => slot !== null);
  }

  get remainingEntries(): LeaderboardEntry[] {
    return this.leaderboard.slice(3);
  }

  getAvatarUrl(entry: LeaderboardEntry): string {
    return entry.avatar_url || 'https://ui-avatars.com/api/?background=0f172a&color=ffffff&name=' + encodeURIComponent(entry.username);
  }

  getRankPositionForRemaining(index: number): number {
    return index + 4;
  }

  getPodiumClass(slot: PodiumEntry): string {
    if (slot.medalClass === 'gold') {
      return 'rankings-podium__card--gold';
    }
    if (slot.medalClass === 'silver') {
      return 'rankings-podium__card--silver';
    }
    return 'rankings-podium__card--bronze';
  }

  getPedestalClass(slot: PodiumEntry): string {
    if (slot.medalClass === 'gold') {
      return 'rankings-podium__pedestal--gold';
    }
    if (slot.medalClass === 'silver') {
      return 'rankings-podium__pedestal--silver';
    }
    return 'rankings-podium__pedestal--bronze';
  }
}
