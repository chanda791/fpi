"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicationService = void 0;
const prisma_1 = require("../lib/prisma");
exports.publicationService = {
    getAll() {
        return prisma_1.prisma.publication.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
    },
    getById(id) {
        return prisma_1.prisma.publication.findUnique({
            where: { id },
        });
    },
    create(data) {
        return prisma_1.prisma.publication.create({
            data,
        });
    },
    update(id, data) {
        return prisma_1.prisma.publication.update({
            where: { id },
            data,
        });
    },
    remove(id) {
        return prisma_1.prisma.publication.delete({
            where: { id },
        });
    },
};
//# sourceMappingURL=publication.service.js.map