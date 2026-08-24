import { api } from "./api";

export interface HubEvent {
  id: number;
  title: string;
  description?: string;
  eventType: "Training" | "Community";
  eventDate: string;
  completed?: boolean;
  hubId: number;
  hub?: { id: number; name: string };
}

export const hubEventService = {
  getAll: () => api.get<HubEvent[]>("/hub-events"),
  create: (data: Partial<HubEvent>) => api.post<HubEvent>("/hub-events", data),
  update: (id: number, data: Partial<HubEvent>) => api.put<HubEvent>(`/hub-events/${id}`, data),
  remove: (id: number) => api.delete(`/hub-events/${id}`),
};
