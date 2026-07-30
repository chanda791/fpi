import {prisma} from "../lib/prisma";

export const reportService = {
  getAll: () => {
    return prisma.report.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  getById: (id: number) => {
    return prisma.report.findUnique({
      where: { id },
    });
  },

  create: (data: any) => {
    return prisma.report.create({
      data,
    });
  },

  update: (
    id: number,
    data: any
  ) => {
    return prisma.report.update({
      where: { id },
      data,
    });
  },

  remove: (id: number) => {
    return prisma.report.delete({
      where: { id },
    });
  },
};