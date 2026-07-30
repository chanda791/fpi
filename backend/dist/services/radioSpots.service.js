"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.radioSpotService = void 0;
const prisma_1 = require("../lib/prisma");
exports.radioSpotService = {
    getAll() {
        return prisma_1.prisma.radioSpot.findMany({
            where: {
                published: true,
            },
            orderBy: {
                broadcastAt: "desc",
            },
        });
    },
    getById(id) {
        return prisma_1.prisma.radioSpot.findUnique({
            where: { id },
        });
    },
    create(data) {
        return prisma_1.prisma.radioSpot.create({
            data,
        });
    },
    update(id, data) {
        return prisma_1.prisma.radioSpot.update({
            where: { id },
            data,
        });
    },
    delete(id) {
        return prisma_1.prisma.radioSpot.delete({
            where: { id },
        });
    },
};
//# sourceMappingURL=radioSpots.service.js.map