import { api } from "./api";

export interface SiteSettings {
  id: number;
  organisation: string;
  mission?: string;
  vision?: string;
  email?: string;
  phone?: string;
  address?: string;
  logo?: string;
  favicon?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  linkedin?: string;
  seoTitle?: string;
  seoDescription?: string;
  footerText?: string;
  copyrightText?: string;
  analyticsId?: string;
  maintenanceMode: boolean;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpFromEmail?: string;
  smtpFromName?: string;
  smtpPasswordSet?: boolean;
}

export const settingsService = {
  get(): Promise<SiteSettings> {
    return api.get<SiteSettings>("/settings");
  },

  update(data: Partial<SiteSettings> & { smtpPassword?: string }): Promise<SiteSettings> {
    return api.put<SiteSettings>("/settings", data);
  },
};
