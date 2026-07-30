import { BaseService } from "./BaseService";
import { api } from "./api";
import { HomepageSection } from "../types/homepage";

class HomepageService extends BaseService<HomepageSection> {
  constructor() {
    super("/homepage");
  }

  getSections() {
    return this.getAll();
  }

  getSection(section: string) {
    return api.get<HomepageSection>(
      `/homepage/${section}`
    );
  }

  updateSection(
    section: string,
    data: any
  ) {
    return api.put<HomepageSection>(
      `/homepage/${section}`,
      data
    );
  }
}

export const homepageService =
  new HomepageService();