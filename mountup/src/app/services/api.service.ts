import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import {
  Ascent,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  MessageResponse,
  Mountain,
  MountainDetailResponse,
  ProfileResponse,
  RegisterRequest,
  RegisterResponse,
} from '../interfaces/api';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  register(payload: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.baseUrl}/register/`, payload);
  }

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login/`, payload);
  }

  logout(payload: LogoutRequest): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.baseUrl}/logout/`, payload);
  }

  getMountains(): Observable<Mountain[]> {
    return this.http.get<Mountain[]>(`${this.baseUrl}/mountains/`);
  }

  getMountainById(id: number): Observable<MountainDetailResponse> {
    return this.http.get<MountainDetailResponse>(`${this.baseUrl}/mountains/${id}/`);
  }

  getProfile(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(`${this.baseUrl}/profile/`);
  }

  getAscents(): Observable<Ascent[]> {
    return this.http.get<Ascent[]>(`${this.baseUrl}/ascents/`);
  }
}
