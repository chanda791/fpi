import { api } from "./api";

export class BaseService<T> {
  constructor(private endpoint: string) {}

  /**
   * GET ALL
   */
  getAll(): Promise<T[]> {
    return api.get<T[]>(this.endpoint, {});
  }

  /**
   * GET ONE
   */
  getById(id: number): Promise<T> {
    return api.get<T>(`${this.endpoint}/${id}`, {});
  }

  /**
   * CREATE
   */
  create(data: Partial<T>): Promise<T> {
    return api.post<T>(this.endpoint, data);
  }

  /**
   * UPDATE
   */
  update(
    id: number,
    data: Partial<T>
  ): Promise<T> {
    return api.put<T>(
      `${this.endpoint}/${id}`,
      data
    );
  }

  /**
   * DELETE
   */
  remove(id: number) {
    return api.delete(
      `${this.endpoint}/${id}`
    );
  }
}