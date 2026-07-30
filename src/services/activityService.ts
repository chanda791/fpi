import { BaseService } from "./BaseService";
import { Activity } from "../types/activity";

export const activityService =
  new BaseService<Activity>("/activities");