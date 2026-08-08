import { BaseService } from "./BaseService";

export interface Newsletter {
  id: number;
  title: string;
  description?: string;
  fileUrl: string;
  image?: string;
  publishDate?: string;
  published: boolean;
  createdAt: string;
}

export const newsletterService =
  new BaseService<Newsletter>("/newsletters");
