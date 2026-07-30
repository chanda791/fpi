import { BaseService } from "./BaseService";

export interface Province {
  id: number;
  name: string;
}

export const provinceService =
  new BaseService<Province>("/provinces");