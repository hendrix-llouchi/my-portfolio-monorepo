export interface Experience {
  id: number;
  company: string;
  role: string;
  period: string;
  description: string;
  technologies: string[] | null;
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  tech_stack: string[];
  image_url?: string | null;
  demo_link?: string | null;
  repo_link?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  proficiency: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface ContactFormState {
  name: string;
  email: string;
  phone: string;
  message: string;
}