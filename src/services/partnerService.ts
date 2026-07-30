import { api } from "./api";

export interface Partner {
  id: number;
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  category?: string;
  displayOrder: number;
  published: boolean;
}

export const partnerService = {
  getAll: () => api.get<Partner[]>("/partners"),
  getById: (id: number) => api.get<Partner>(`/partners/${id}`),
  create: (data: Partial<Partner>) => api.post<Partner>("/partners", data),
  update: (id: number, data: Partial<Partner>) => api.put<Partner>(`/partners/${id}`, data),
  remove: (id: number) => api.delete(`/partners/${id}`),
};
