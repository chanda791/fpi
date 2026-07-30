import { api } from "./api";

export interface Donor {
  id: number;
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  tier?: string;
  displayOrder: number;
  published: boolean;
}

export const donorService = {
  getAll: () => api.get<Donor[]>("/donors"),
  getById: (id: number) => api.get<Donor>(`/donors/${id}`),
  create: (data: Partial<Donor>) => api.post<Donor>("/donors", data),
  update: (id: number, data: Partial<Donor>) => api.put<Donor>(`/donors/${id}`, data),
  remove: (id: number) => api.delete(`/donors/${id}`),
};
