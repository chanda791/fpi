import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class BaseService<T> {
  constructor(private model: any) {}

  async getAll() {
    return this.model.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getById(id: number) {
    return this.model.findUnique({
      where: { id },
    });
  }

  async create(data: T) {
    return this.model.create({
      data,
    });
  }

  async update(id: number, data: Partial<T>) {
    return this.model.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.model.delete({
      where: { id },
    });
  }
}

export default prisma;