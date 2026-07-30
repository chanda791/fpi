import { prisma } from "../lib/prisma";

export const radioSpotService = {

  getAll() {
    return prisma.radioSpot.findMany({
      where: {
        published: true,
      },
      orderBy: {
        broadcastAt: "desc",
      },
    });
  },

  getById(id: number) {
    return prisma.radioSpot.findUnique({
      where: { id },
    });
  },

  create(data: any) {
    return prisma.radioSpot.create({
      data,
    });
  },

  update(id: number, data: any) {
    return prisma.radioSpot.update({
      where: { id },
      data,
    });
  },

  delete(id: number) {
    return prisma.radioSpot.delete({
      where: { id },
    });
  },

};