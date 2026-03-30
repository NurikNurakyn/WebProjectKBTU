import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CLIMBER_RANK_MAP, CLIMBER_RANKS, type ClimberRank } from '../../data/mountains.data';

interface DashboardStat {
  label: string;
  value: string;
  note: string;
  icon: string;
}

interface VisitedMountain {
  id: string;
  name: string;
  location: string;
  date: string;
  status: string;
  minimumRankId: number;
}

@Component({
  selector: 'app-profile',
  imports: [RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  readonly backendBindingHint = 'Frontend placeholders only. Client/admin can fill this data now and backend can bind real payload later.';

  readonly profileSnapshot = {
    climberName: 'Client Editable Name',
    level: 'Level 12',
    experience: '4,850 XP',
    confirmedMountains: 4,
    currentRankId: 2,
  };

  readonly visitedMountains: VisitedMountain[] = [
    {
      id: 'vm-1',
      name: 'Peak Furmanov',
      location: 'Ile Alatau',
      date: 'Client fills date',
      status: 'Confirmed',
      minimumRankId: 1,
    },
    {
      id: 'vm-2',
      name: 'Big Almaty Peak',
      location: 'Ile Alatau',
      date: 'Client fills date',
      status: 'Pending verification',
      minimumRankId: 2,
    },
    {
      id: 'vm-3',
      name: 'Talgar Peak',
      location: 'Trans-Ili Alatau',
      date: 'Client fills date',
      status: 'Planned',
      minimumRankId: 3,
    },
  ];

  readonly dashboardStats: DashboardStat[] = [
    {
      label: 'Current Rank',
      value: this.getRank(this.profileSnapshot.currentRankId).title,
      note: this.getRank(this.profileSnapshot.currentRankId).requirement,
      icon: 'workspace_premium',
    },
    {
      label: 'Level',
      value: this.profileSnapshot.level,
      note: this.profileSnapshot.experience,
      icon: 'military_tech',
    },
    {
      label: 'Confirmed Mountains',
      value: String(this.profileSnapshot.confirmedMountains),
      note: 'Editable by client/admin in backend mode',
      icon: 'mountain_flag',
    },
  ];

  getRank(rankId: number): ClimberRank {
    return CLIMBER_RANK_MAP.get(rankId) ?? CLIMBER_RANKS[0];
  }
}