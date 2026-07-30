import { BaseService } from "./BaseService";
import { Project } from "../types/project";

export const projectService =
  new BaseService<Project>("/projects");