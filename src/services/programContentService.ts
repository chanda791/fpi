import { api } from "./api";

export interface ProgramSection {
  heading?: string;
  body?: string;
  image?: string;
}

export interface ProgramContent {
  id: number;
  slug: string;
  title: string;
  subtitle?: string;
  heroImage?: string;
  intro?: string;
  sections?: ProgramSection[];
  published: boolean;
}

export const programContentService = {
  getAll: () => api.get<ProgramContent[]>("/program-content"),
  getBySlug: (slug: string) => api.get<ProgramContent>(`/program-content/${slug}`),
  update: (slug: string, data: Partial<ProgramContent>) =>
    api.put<ProgramContent>(`/program-content/${slug}`, data),
};
