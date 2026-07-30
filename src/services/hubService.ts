import { BaseService } from "./BaseService";

export interface Hub {
  id: number;
  name: string;
  slug: string;
  location?: string;
  coordinator?: string;
  participants: number;
  description?: string;
  image?: string;
  provinceId: number;
  published: boolean;
}

export const hubService =
  new BaseService<Hub>("/hubs");