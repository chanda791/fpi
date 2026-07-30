"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePublication = exports.updatePublication = exports.createPublication = exports.getPublication = exports.getPublications = void 0;
const publication_service_1 = require("../services/publication.service");
const getPublications = async (req, res) => {
    try {
        const publications = await publication_service_1.publicationService.getAll();
        res.json(publications);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch publications",
        });
    }
};
exports.getPublications = getPublications;
const getPublication = async (req, res) => {
    try {
        const publication = await publication_service_1.publicationService.getById(Number(req.params.id));
        res.json(publication);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch publication",
        });
    }
};
exports.getPublication = getPublication;
const createPublication = async (req, res) => {
    try {
        const publication = await publication_service_1.publicationService.create(req.body);
        res.status(201).json(publication);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to create publication",
        });
    }
};
exports.createPublication = createPublication;
const updatePublication = async (req, res) => {
    try {
        const publication = await publication_service_1.publicationService.update(Number(req.params.id), req.body);
        res.json(publication);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to update publication",
        });
    }
};
exports.updatePublication = updatePublication;
const deletePublication = async (req, res) => {
    try {
        await publication_service_1.publicationService.remove(Number(req.params.id));
        res.json({
            message: "Publication deleted",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to delete publication",
        });
    }
};
exports.deletePublication = deletePublication;
//# sourceMappingURL=publications.controller.js.map