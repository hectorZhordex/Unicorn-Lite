export interface Artwork {
  id: string;
  title: string;
  slug: string;
  description: string;
  preview_url: string;
  download_url: string;
  category_id: string;
  category?: Category;
  tags: string[];
  resolution?: string;
  file_size?: string;
  file_format?: string;
  views: number;
  downloads: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  artwork_count?: number;
  created_at: string;
}

export interface Verification {
  id: string;
  artwork_id: string;
  session_id: string;
  steps_completed: number;
  required_steps: number;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface VerificationStep {
  step: number;
  completed: boolean;
  timestamp?: string;
}

export interface Download {
  id: string;
  artwork_id: string;
  session_id: string;
  created_at: string;
}

export interface AdminStats {
  total_artworks: number;
  total_downloads: number;
  total_views: number;
  total_verifications: number;
  recent_downloads: RecentDownload[];
}

export interface RecentDownload {
  id: string;
  artwork_title: string;
  created_at: string;
}

export type ArtworkUploadForm = {
  title: string;
  description: string;
  category_id: string;
  tags: string;
  resolution: string;
  file_format: string;
  is_featured: boolean;
  preview_image: File | null;
  download_file: File | null;
};
