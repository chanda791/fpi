import { prisma } from "../lib/prisma";

const homepageSection = (prisma as any).homepageSection;

export const homepageService = {
  getAll() {
    return homepageSection.findMany({
      orderBy: {
        id: "asc",
      },
    });
  },

  getSection(section: string) {
    return homepageSection.findUnique({
      where: {
        section,
      },
    });
  },

  create(data: any) {
    return homepageSection.create({
      data,
    });
  },

  update(section: string, data: any) {
    return homepageSection.upsert({
      where: {
        section,
      },
      update: data,
      create: {
        section,
        ...data,
      },
    });
  },

  remove(id: number) {
    return homepageSection.delete({
      where: {
        id,
      },
    });
  },
};