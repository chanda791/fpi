import { api } from "./api";

export interface Resource {
  id: number;
  title: string;
  description?: string;
  fileUrl?: string;
  link?: string;
  category?: string;
  thumbnail?: string;
  displayOrder: number;
  published: boolean;
}

export const resourceService = {
  getAll: () => api.get<Resource[]>("/resources"),
  getById: (id: number) => api.get<Resource>(`/resources/${id}`),
  create: (data: Partial<Resource>) => api.post<Resource>("/resources", data),
  update: (id: number, data: Partial<Resource>) => api.put<Resource>(`/resources/${id}`, data),
  remove: (id: number) => api.delete(`/resources/${id}`),
};
