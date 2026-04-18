import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteHeaderComponent } from '../../components/site-header/site-header';

@Component({
  selector: 'app-about',
  imports: [RouterLink, SiteHeaderComponent],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {}
