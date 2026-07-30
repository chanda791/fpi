import { Request, Response } from "express";
import { reportService } from "../services/report.service";

export const getReports = async (
  req: Request,
  res: Response
) => {
  try {
    const reports = await reportService.getAll();
    res.json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch reports",
    });
  }
};

export const getReport = async (
  req: Request,
  res: Response
) => {
  try {
    const report = await reportService.getById(
      Number(req.params.id)
    );

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    res.json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch report",
    });
  }
};

export const createReport = async (
  req: Request,
  res: Response
) => {
  try {
    const report = await reportService.create(req.body);

    res.status(201).json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create report",
    });
  }
};

export const updateReport = async (
  req: Request,
  res: Response
) => {
  try {
    const report = await reportService.update(
      Number(req.params.id),
      req.body
    );

    res.json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update report",
    });
  }
};

export const deleteReport = async (
  req: Request,
  res: Response
) => {
  try {
    await reportService.remove(
      Number(req.params.id)
    );

    res.json({
      message: "Report deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to delete report",
    });
  }
};