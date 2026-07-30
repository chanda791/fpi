import {prisma} from "../lib/prisma";

export const newsletterService = {
  getAll: () => {
    return prisma.newsletter.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  getById: (id: number) => {
    return prisma.newsletter.findUnique({
      where: { id },
    });
  },

  create: (data: any) => {
    return prisma.newsletter.create({
      data,
    });
  },

  update: (id: number, data: any) => {
    return prisma.newsletter.update({
      where: { id },
      data,
    });
  },

  remove: (id: number) => {
    return prisma.newsletter.delete({
      where: { id },
    });
  },
};