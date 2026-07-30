import { Request, Response } from "express";
import { homepageService } from "../services/homepage.service";

export const getHomepage = async (
  req: Request,
  res: Response
) => {
  try {
    const data = await homepageService.getAll();

    res.json(data);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch homepage.",
    });
  }
};

export const getHomepageSection = async (
  req: Request,
  res: Response
) => {
  try {
    const section = Array.isArray(req.params.section)
      ? req.params.section[0]
      : (req.params.section ?? "");

    const data = await homepageService.getSection(section);

    res.json(data);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch section.",
    });
  }
};

export const updateHomepageSection =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const section = Array.isArray(req.params.section)
        ? req.params.section[0]
        : (req.params.section ?? "");

      const data = await homepageService.update(section, req.body);

      res.json(data);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Unable to save section.",
      });
    }
  };