import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CLIMBER_RANK_MAP, CLIMBER_RANKS, MOUNTAIN_WIKI, type ClimberRank } from '../../data/mountains.data';

@Component({
  selector: 'app-catalog',
  imports: [RouterLink],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class Catalog {
  readonly mountains = MOUNTAIN_WIKI;

  getMinimumRank(rankId: number): ClimberRank {
    return CLIMBER_RANK_MAP.get(rankId) ?? CLIMBER_RANKS[0];
  }
}