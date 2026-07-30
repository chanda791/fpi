"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class BaseService {
    constructor(model) {
        this.model = model;
    }
    async getAll() {
        return this.model.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async getById(id) {
        return this.model.findUnique({
            where: { id },
        });
    }
    async create(data) {
        return this.model.create({
            data,
        });
    }
    async update(id, data) {
        return this.model.update({
            where: { id },
            data,
        });
    }
    async remove(id) {
        return this.model.delete({
            where: { id },
        });
    }
}
exports.BaseService = BaseService;
exports.default = prisma;
//# sourceMappingURL=BaseService.js.map