"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.homepageService = void 0;
const prisma_1 = require("../lib/prisma");
const homepageSection = prisma_1.prisma.homepageSection;
exports.homepageService = {
    getAll() {
        return homepageSection.findMany({
            orderBy: {
                id: "asc",
            },
        });
    },
    getSection(section) {
        return homepageSection.findUnique({
            where: {
                section,
            },
        });
    },
    create(data) {
        return homepageSection.create({
            data,
        });
    },
    update(section, data) {
        return homepageSection.upsert({
            where: {
                section,
            },
            update: data,
            create: {
                section,
                ...data,
            },
        });
    },
    remove(id) {
        return homepageSection.delete({
            where: {
                id,
            },
        });
    },
};
//# sourceMappingURL=homepage.service.js.map