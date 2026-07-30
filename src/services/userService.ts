import { api } from "./api";

export interface AdminUser {
  id: number;
  fullName: string;
  email: string;
  role: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export const userService = {
  getAll(): Promise<AdminUser[]> {
    return api.get<AdminUser[]>("/users");
  },

  create(data: {
    fullName: string;
    email: string;
    password: string;
    role: string;
  }): Promise<AdminUser> {
    return api.post<AdminUser>("/users", data);
  },

  update(
    id: number,
    data: Partial<Pick<AdminUser, "fullName" | "role" | "active">>
  ): Promise<AdminUser> {
    return api.put<AdminUser>(`/users/${id}`, data);
  },

  resetPassword(id: number, password: string): Promise<{ message: string }> {
    return api.post<{ message: string }>(`/users/${id}/reset-password`, {
      password,
    });
  },

  remove(id: number) {
    return api.delete(`/users/${id}`);
  },
};
