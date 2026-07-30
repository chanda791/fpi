import { BaseService } from "./BaseService";
import { TeamMember } from "../types/team";

export const teamService =
  new BaseService<TeamMember>("/team");