import { api } from "./api";

export interface Subscriber {
  id: number;
  email: string;
  name?: string;
  active: boolean;
  createdAt: string;
}

export const subscriberService = {
  getAll: () => api.get<Subscriber[]>("/subscribers"),
  subscribe: (email: string, name?: string) => api.post<{ message: string }>("/subscribers", { email, name }),
  remove: (id: number) => api.delete(`/subscribers/${id}`),
  broadcast: (subject: string, message: string) =>
    api.post<{ message: string; sent?: number; total?: number }>("/subscribers/broadcast", { subject, message }),
};
