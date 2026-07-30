"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportService = void 0;
const prisma_1 = require("../lib/prisma");
exports.reportService = {
    getAll: () => {
        return prisma_1.prisma.report.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
    },
    getById: (id) => {
        return prisma_1.prisma.report.findUnique({
            where: { id },
        });
    },
    create: (data) => {
        return prisma_1.prisma.report.create({
            data,
        });
    },
    update: (id, data) => {
        return prisma_1.prisma.report.update({
            where: { id },
            data,
        });
    },
    remove: (id) => {
        return prisma_1.prisma.report.delete({
            where: { id },
        });
    },
};
//# sourceMappingURL=report.service.js.map