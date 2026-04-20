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
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  difficulty_label: string;
  description: string;
  is_featured: boolean;
  created_by: number;
  created_by_username: string;
}

export interface MountainCheckpoint {
  name: string;
  elevation_m: number;
  eta_hours: number;
}

export interface MountainGearItem {
  icon: string;
  label: string;
}

export interface MountainDetailResponse extends Mountain {
  progress_and_rewards: {
    xp_reward: number;
    recommended_level: number;
    difficulty_badge: string;
    estimated_duration_hours: number;
  };
  safety_panel: {
    weather_window: string;
    avalanche_risk: string;
    last_update: string;
  };
  route_checkpoints: MountainCheckpoint[];
  gear_checklist: {
    mandatory: MountainGearItem[];
    recommended: MountainGearItem[];
  };
  community_stats: {
    ascents_count: number;
    completed_ascents_count: number;
    average_difficulty_rating: number;
    common_comment_themes: string[];
    recent_comments: Array<{
      username: string;
      body: string;
      created_at: string;
    }>;
  };
}

export interface NextRank {
  title: string;
  threshold: number;
  points_left: number;
}

export interface HighestMountain {
  name: string;
  elevation_m: number;
}

export interface RecentAscent {
  mountain_name: string;
  elevation_m: number;
  climbed_on: string;
  awarded_xp: number;
}

export interface AscentBreakdown {
  under_4500: number;
  from_4500_to_5999: number;
  from_6000_to_7999: number;
  over_or_equal_8000: number;
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
  completed_ascents_count: number;
  total_elevation_climbed_m: number;
  highest_mountain: HighestMountain | null;
  recent_ascent: RecentAscent | null;
  ascent_breakdown: AscentBreakdown;
}

export interface Ascent {
  id: number;
  mountain: number;
  mountain_name: string;
  mountain_elevation_m: number;
  mountain_difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  mountain_difficulty_label: string;
  climbed_on: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'planned';
  awarded_xp: number;
}

export interface MessageResponse {
  message: string;
}
