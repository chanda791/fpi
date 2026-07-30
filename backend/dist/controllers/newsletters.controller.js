"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNewsletter = exports.updateNewsletter = exports.createNewsletter = exports.getNewsletter = exports.getNewsletters = void 0;
const newsletter_service_1 = require("../services/newsletter.service");
const getNewsletters = async (req, res) => {
    try {
        const newsletters = await newsletter_service_1.newsletterService.getAll();
        res.json(newsletters);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch newsletters",
        });
    }
};
exports.getNewsletters = getNewsletters;
const getNewsletter = async (req, res) => {
    try {
        const newsletter = await newsletter_service_1.newsletterService.getById(Number(req.params.id));
        if (!newsletter) {
            return res.status(404).json({
                message: "Newsletter not found",
            });
        }
        res.json(newsletter);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch newsletter",
        });
    }
};
exports.getNewsletter = getNewsletter;
const createNewsletter = async (req, res) => {
    try {
        const newsletter = await newsletter_service_1.newsletterService.create(req.body);
        res.status(201).json(newsletter);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to create newsletter",
        });
    }
};
exports.createNewsletter = createNewsletter;
const updateNewsletter = async (req, res) => {
    try {
        const newsletter = await newsletter_service_1.newsletterService.update(Number(req.params.id), req.body);
        res.json(newsletter);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to update newsletter",
        });
    }
};
exports.updateNewsletter = updateNewsletter;
const deleteNewsletter = async (req, res) => {
    try {
        await newsletter_service_1.newsletterService.remove(Number(req.params.id));
        res.json({
            message: "Newsletter deleted successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to delete newsletter",
        });
    }
};
exports.deleteNewsletter = deleteNewsletter;
//# sourceMappingURL=newsletters.controller.js.map