import { BaseService } from "./BaseService";

export interface PressStatement {
  id: number;
  title: string;
  description?: string;
  fileUrl: string;
  image?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export const pressStatementService =
  new BaseService<PressStatement>("/press-statements");