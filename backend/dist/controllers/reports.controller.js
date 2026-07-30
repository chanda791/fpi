"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReport = exports.updateReport = exports.createReport = exports.getReport = exports.getReports = void 0;
const report_service_1 = require("../services/report.service");
const getReports = async (req, res) => {
    try {
        const reports = await report_service_1.reportService.getAll();
        res.json(reports);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch reports",
        });
    }
};
exports.getReports = getReports;
const getReport = async (req, res) => {
    try {
        const report = await report_service_1.reportService.getById(Number(req.params.id));
        if (!report) {
            return res.status(404).json({
                message: "Report not found",
            });
        }
        res.json(report);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch report",
        });
    }
};
exports.getReport = getReport;
const createReport = async (req, res) => {
    try {
        const report = await report_service_1.reportService.create(req.body);
        res.status(201).json(report);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to create report",
        });
    }
};
exports.createReport = createReport;
const updateReport = async (req, res) => {
    try {
        const report = await report_service_1.reportService.update(Number(req.params.id), req.body);
        res.json(report);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to update report",
        });
    }
};
exports.updateReport = updateReport;
const deleteReport = async (req, res) => {
    try {
        await report_service_1.reportService.remove(Number(req.params.id));
        res.json({
            message: "Report deleted successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to delete report",
        });
    }
};
exports.deleteReport = deleteReport;
//# sourceMappingURL=reports.controller.js.map