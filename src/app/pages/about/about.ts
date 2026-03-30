import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CLIMBER_RANKS } from '../../data/mountains.data';

@Component({
  selector: 'app-about',
  imports: [RouterLink],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  readonly ranks = CLIMBER_RANKS;
}
