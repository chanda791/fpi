import { Request, Response } from "express";
import { publicationService } from "../services/publication.service";

export const getPublications = async (
  req: Request,
  res: Response
) => {
  try {
    const publications =
      await publicationService.getAll();

    res.json(publications);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch publications",
    });
  }
};

export const getPublication = async (
  req: Request,
  res: Response
) => {
  try {
    const publication =
      await publicationService.getById(
        Number(req.params.id)
      );

    res.json(publication);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch publication",
    });
  }
};

export const createPublication = async (
  req: Request,
  res: Response
) => {
  try {
    const publication =
      await publicationService.create(req.body);

    res.status(201).json(publication);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create publication",
    });
  }
};

export const updatePublication = async (
  req: Request,
  res: Response
) => {
  try {
    const publication =
      await publicationService.update(
        Number(req.params.id),
        req.body
      );

    res.json(publication);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update publication",
    });
  }
};

export const deletePublication = async (
  req: Request,
  res: Response
) => {
  try {
    await publicationService.remove(
      Number(req.params.id)
    );

    res.json({
      message: "Publication deleted",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete publication",
    });
  }
};