import { Component, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthUser } from '../../interfaces/api';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink],
  templateUrl: './site-header.html',
  styleUrls: ['./site-header.css'],
})
export class SiteHeaderComponent {
  @Input() activeNav: 'home' | 'guides' | 'leaderboard' | 'about' | '' = '';

  isMenuOpen = false;
  currentUser: AuthUser | null = null;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {
    this.refreshUser();
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  get displayName(): string {
    return this.currentUser?.username || 'Account';
  }

  get avatarUrl(): string {
    return this.currentUser?.avatar_url || '';
  }

  isActive(tab: 'home' | 'guides' | 'leaderboard' | 'about'): boolean {
    return this.activeNav === tab;
  }

  toggleMenu(): void {
    this.refreshUser();
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.afterLogout();
      },
      error: () => {
        this.authService.clearSession();
        this.afterLogout();
      },
    });
  }

  private refreshUser(): void {
    this.currentUser = this.authService.getUser();
  }

  private afterLogout(): void {
    this.isMenuOpen = false;
    this.currentUser = null;
    this.router.navigate(['/landing']);
  }
}
//hello