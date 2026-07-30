import { Request, Response } from "express";
import { newsletterService } from "../services/newsletter.service";

export const getNewsletters = async (
  req: Request,
  res: Response
) => {
  try {
    const newsletters = await newsletterService.getAll();
    res.json(newsletters);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch newsletters",
    });
  }
};

export const getNewsletter = async (
  req: Request,
  res: Response
) => {
  try {
    const newsletter = await newsletterService.getById(
      Number(req.params.id)
    );

    if (!newsletter) {
      return res.status(404).json({
        message: "Newsletter not found",
      });
    }

    res.json(newsletter);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch newsletter",
    });
  }
};

export const createNewsletter = async (
  req: Request,
  res: Response
) => {
  try {
    const newsletter = await newsletterService.create(req.body);

    res.status(201).json(newsletter);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create newsletter",
    });
  }
};

export const updateNewsletter = async (
  req: Request,
  res: Response
) => {
  try {
    const newsletter = await newsletterService.update(
      Number(req.params.id),
      req.body
    );

    res.json(newsletter);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update newsletter",
    });
  }
};

export const deleteNewsletter = async (
  req: Request,
  res: Response
) => {
  try {
    await newsletterService.remove(Number(req.params.id));

    res.json({
      message: "Newsletter deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to delete newsletter",
    });
  }
};