import { BaseService } from "./BaseService";

export interface Publication {
  id: number;
  title: string;
  description?: string;
  fileUrl: string;
  image?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export const publicationService =
  new BaseService<Publication>("/publications");