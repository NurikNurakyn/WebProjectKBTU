import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteHeaderComponent } from '../../components/site-header/site-header';

@Component({
  selector: 'app-landing',
  imports: [RouterLink, SiteHeaderComponent],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {
  isTermsOpen = false;
  isSafetyOpen = false;

  openTerms(): void {
    this.isTermsOpen = true;
  }

  closeTerms(): void {
    this.isTermsOpen = false;
  }

  openSafety(): void {
    this.isSafetyOpen = true;
  }

  closeSafety(): void {
    this.isSafetyOpen = false;
  }
}
