import { BaseService } from "./BaseService";

export interface RadioSpot {
  id: number;
  title: string;
  description?: string;
  station: string;
  duration?: string;
  image?: string;
  audioUrl?: string;
  broadcastAt: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export const radioSpotService =
  new BaseService<RadioSpot>("/radio-spots");