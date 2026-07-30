import { BaseService } from "./BaseService";

export interface Media {
  id: number;
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  alt?: string;
  caption?: string;
  description?: string;
  folder?: string;
  createdAt: string;
  updatedAt: string;
}

export const mediaService =
  new BaseService<Media>("/media");
