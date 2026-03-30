import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CLIMBER_RANK_MAP, CLIMBER_RANKS, type ClimberRank, MOUNTAIN_WIKI_MAP, type MountainWiki } from '../../data/mountains.data';

@Component({
  selector: 'app-mountain-detail',
  imports: [RouterLink],
  templateUrl: './mountain-detail.html',
  styleUrl: './mountain-detail.css',
})
export class MountainDetail {
  private readonly route = inject(ActivatedRoute);

  readonly mountain = this.getMountain();
  readonly minimumRank = this.mountain ? this.getRank(this.mountain.minimumRankId) : CLIMBER_RANKS[0];

  private getMountain(): MountainWiki | null {
    const mountainId = this.route.snapshot.paramMap.get('id');

    if (!mountainId) {
      return null;
    }

    return MOUNTAIN_WIKI_MAP.get(mountainId) ?? null;
  }

  private getRank(rankId: number): ClimberRank {
    return CLIMBER_RANK_MAP.get(rankId) ?? CLIMBER_RANKS[0];
  }
}
