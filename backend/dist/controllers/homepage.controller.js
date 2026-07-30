"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateHomepageSection = exports.getHomepageSection = exports.getHomepage = void 0;
const homepage_service_1 = require("../services/homepage.service");
const getHomepage = async (req, res) => {
    try {
        const data = await homepage_service_1.homepageService.getAll();
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch homepage.",
        });
    }
};
exports.getHomepage = getHomepage;
const getHomepageSection = async (req, res) => {
    try {
        const section = Array.isArray(req.params.section)
            ? req.params.section[0]
            : (req.params.section ?? "");
        const data = await homepage_service_1.homepageService.getSection(section);
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch section.",
        });
    }
};
exports.getHomepageSection = getHomepageSection;
const updateHomepageSection = async (req, res) => {
    try {
        const section = Array.isArray(req.params.section)
            ? req.params.section[0]
            : (req.params.section ?? "");
        const data = await homepage_service_1.homepageService.update(section, req.body);
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Unable to save section.",
        });
    }
};
exports.updateHomepageSection = updateHomepageSection;
//# sourceMappingURL=homepage.controller.js.map