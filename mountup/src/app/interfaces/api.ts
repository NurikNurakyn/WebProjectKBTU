export interface AuthUser {
  id: number;
  username: string;
  email: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  full_name?: string;
  country?: string;
}

export interface RegisterResponse {
  id: number;
  username: string;
  email: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: AuthUser;
}

export interface LogoutRequest {
  refresh: string;
}

export interface ApiErrorResponse {
  error?: string;
  detail?: string;
}

export interface Mountain {
  id: number;
  name: string;
  location: string;
  image_url: string;
  elevation_m: number;
  difficulty: string;
  description: string;
  is_featured: boolean;
  created_by: number;
  created_by_username: string;
}

export interface NextRank {
  title: string;
  threshold: number;
  points_left: number;
}

export interface ProfileResponse {
  username: string;
  email: string;
  country: string;
  bio: string;
  experience_points: number;
  level: number;
  rank_title: string;
  next_rank: NextRank | null;
  ascents_count: number;
}

export interface Ascent {
  id: number;
  mountain: number;
  mountain_name: string;
  climbed_on: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'planned';
}

export interface MessageResponse {
  message: string;
}
