import { api } from "./api";

export interface Testimonial {
  id: number;
  name: string;
  role?: string;
  message: string;
  photo?: string;
  rating?: number;
  approved: boolean;
  createdAt: string;
}

export const testimonialService = {
  getAll: (all = false) => api.get<Testimonial[]>(`/testimonials${all ? "?all=true" : ""}`),
  create: (data: Partial<Testimonial>) => api.post<any>("/testimonials", data),
  update: (id: number, data: Partial<Testimonial>) => api.put<Testimonial>(`/testimonials/${id}`, data),
  remove: (id: number) => api.delete(`/testimonials/${id}`),
};
