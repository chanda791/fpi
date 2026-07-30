import { api } from "./api";

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject?: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export const contactService = {
  getAll: () => api.get<ContactMessage[]>("/contact"),
  send: (data: { name: string; email: string; subject?: string; message: string }) =>
    api.post<{ message: string }>("/contact", data),
  markRead: (id: number, read: boolean) => api.put<ContactMessage>(`/contact/${id}`, { read }),
  remove: (id: number) => api.delete(`/contact/${id}`),
};
