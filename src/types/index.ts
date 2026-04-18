export interface Project {
  id: number;
  title: string;
  category: string;
  location: string;
  year: string;
  description: string;
  client?: string;
  value?: string;
  size?: string;
  featured: number;
  cover_image?: string;
  images: string;
  created_at?: string;
}
