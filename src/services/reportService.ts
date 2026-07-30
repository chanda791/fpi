import { BaseService } from "./BaseService";

export interface Report {
  id: number;
  title: string;
  description?: string;
  fileUrl: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export const reportService =
  new BaseService<Report>("/reports");
