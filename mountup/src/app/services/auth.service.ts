import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';

import { ApiService } from './api.service';
import {
  AuthUser,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '../interfaces/api';

const ACCESS_TOKEN_STORAGE_KEY = 'mountup_access_token';
const REFRESH_TOKEN_STORAGE_KEY = 'mountup_refresh_token';
const USER_STORAGE_KEY = 'mountup_user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private readonly api: ApiService) {}

  register(payload: RegisterRequest): Observable<RegisterResponse> {
    return this.api.register(payload);
  }

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.api.login(payload).pipe(
      tap((response) => {
        this.setAccessToken(response.access);
        this.setRefreshToken(response.refresh);
        this.setUser(response.user);
      }),
    );
  }

  logout(): Observable<unknown> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.clearSession();
      return of(null);
    }

    return this.api.logout({ refresh: refreshToken }).pipe(tap(() => this.clearSession()));
  }

  clearSession(): void {
    localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
  }

  getUser(): AuthUser | null {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return Boolean(this.getToken());
  }

  private setAccessToken(token: string): void {
    localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
  }

  private setRefreshToken(token: string): void {
    localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, token);
  }

  private setUser(user: AuthUser): void {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }
}
