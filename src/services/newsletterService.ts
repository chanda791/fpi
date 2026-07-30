import { BaseService } from "./BaseService";

export interface Newsletter {
  id: number;
  title: string;
 fileUrl: string;
  createdAt: string;
}

export const newsletterService =
  new BaseService<Newsletter>("/newsletters");