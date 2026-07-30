"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newsletterService = void 0;
const prisma_1 = require("../lib/prisma");
exports.newsletterService = {
    getAll: () => {
        return prisma_1.prisma.newsletter.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
    },
    getById: (id) => {
        return prisma_1.prisma.newsletter.findUnique({
            where: { id },
        });
    },
    create: (data) => {
        return prisma_1.prisma.newsletter.create({
            data,
        });
    },
    update: (id, data) => {
        return prisma_1.prisma.newsletter.update({
            where: { id },
            data,
        });
    },
    remove: (id) => {
        return prisma_1.prisma.newsletter.delete({
            where: { id },
        });
    },
};
//# sourceMappingURL=newsletter.service.js.map