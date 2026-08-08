import { api } from "./api";

export interface HubPhoto {
  id: number;
  imageUrl: string;
  caption?: string;
  hubId: number;
  hub?: { id: number; name: string };
}

export const hubPhotoService = {
  getAll: () => api.get<HubPhoto[]>("/hub-photos"),
  create: (data: Partial<HubPhoto>) => api.post<HubPhoto>("/hub-photos", data),
  remove: (id: number) => api.delete(`/hub-photos/${id}`),
};
