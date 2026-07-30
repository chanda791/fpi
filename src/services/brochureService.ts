import { api } from "./api";

export interface Brochure {
  id: number;
  title: string;
  description?: string;
  fileUrl: string;
  thumbnail?: string;
  displayOrder: number;
  published: boolean;
}

export const brochureService = {
  getAll: () => api.get<Brochure[]>("/brochures"),
  getById: (id: number) => api.get<Brochure>(`/brochures/${id}`),
  create: (data: Partial<Brochure>) => api.post<Brochure>("/brochures", data),
  update: (id: number, data: Partial<Brochure>) => api.put<Brochure>(`/brochures/${id}`, data),
  remove: (id: number) => api.delete(`/brochures/${id}`),
};
