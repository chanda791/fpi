import { prisma } from "../lib/prisma";

export const publicationService = {
  getAll() {
    return prisma.publication.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  getById(id: number) {
    return prisma.publication.findUnique({
      where: { id },
    });
  },

  create(data: any) {
    return prisma.publication.create({
      data,
    });
  },

  update(id: number, data: any) {
    return prisma.publication.update({
      where: { id },
      data,
    });
  },

  remove(id: number) {
    return prisma.publication.delete({
      where: { id },
    });
  },
};