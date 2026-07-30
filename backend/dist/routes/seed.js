"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const router = (0, express_1.Router)();
router.post("/hubs", async (req, res) => {
    try {
        const lusaka = await prisma_1.prisma.province.findFirst({
            where: { name: "Lusaka" },
        });
        const southern = await prisma_1.prisma.province.findFirst({
            where: { name: "Southern" },
        });
        const eastern = await prisma_1.prisma.province.findFirst({
            where: { name: "Eastern" },
        });
        const copperbelt = await prisma_1.prisma.province.findFirst({
            where: { name: "Copperbelt" },
        });
        if (!lusaka || !southern || !eastern || !copperbelt) {
            return res.status(400).json({
                message: "Create provinces first",
            });
        }
        const hubs = [
            // Copperbelt Province
            { name: "Ndola", slug: "ndola", provinceId: copperbelt.id, location: "Ndola, Copperbelt", description: "Media and Information Literacy hub serving the Ndola community.", coordinator: "Hub Coordinator", participants: 0 },
            { name: "Kitwe", slug: "kitwe", provinceId: copperbelt.id, location: "Kitwe, Copperbelt", description: "Media and Information Literacy hub serving the Kitwe community.", coordinator: "Hub Coordinator", participants: 0 },
            { name: "Mufulira", slug: "mufulira", provinceId: copperbelt.id, location: "Mufulira, Copperbelt", description: "Media and Information Literacy hub serving the Mufulira community.", coordinator: "Hub Coordinator", participants: 0 },
            // Greater Lusaka Region
            { name: "Lusaka West", slug: "lusaka-west", provinceId: lusaka.id, location: "Lusaka West", description: "Media and Information Literacy hub serving Lusaka West.", coordinator: "Hub Coordinator", participants: 0 },
            { name: "Mutendere", slug: "mutendere", provinceId: lusaka.id, location: "Mutendere, Lusaka", description: "Media and Information Literacy hub serving Mutendere.", coordinator: "Hub Coordinator", participants: 0 },
            { name: "Kafue", slug: "kafue", provinceId: lusaka.id, location: "Kafue", description: "Media and Information Literacy hub serving the Kafue community.", coordinator: "Hub Coordinator", participants: 0 },
            // Southern Province
            { name: "Mazabuka", slug: "mazabuka", provinceId: southern.id, location: "Mazabuka, Southern", description: "Media and Information Literacy hub serving Mazabuka.", coordinator: "Hub Coordinator", participants: 0 },
            // Eastern Province
            { name: "Chipata", slug: "chipata", provinceId: eastern.id, location: "Chipata, Eastern", description: "Media and Information Literacy hub serving Chipata.", coordinator: "Hub Coordinator", participants: 0 },
            { name: "Petauke", slug: "petauke", provinceId: eastern.id, location: "Petauke, Eastern", description: "Media and Information Literacy hub serving Petauke.", coordinator: "Hub Coordinator", participants: 0 },
        ];
        for (const hub of hubs) {
            const exists = await prisma_1.prisma.hub.findFirst({
                where: {
                    slug: hub.slug,
                },
            });
            if (!exists) {
                await prisma_1.prisma.hub.create({
                    data: {
                        ...hub,
                        coordinator: "TBD",
                        location: hub.name,
                        participants: 0,
                        description: `${hub.name} MIL Hub`,
                    },
                });
            }
        }
        res.json({
            message: "Hubs seeded successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to seed hubs",
        });
    }
});
exports.default = router;
//# sourceMappingURL=seed.js.map