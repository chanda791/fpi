import { BaseService } from "./BaseService";
import { Publication } from "../types/publication";

export const publicationService =
  new BaseService<Publication>("/publications");