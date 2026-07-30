import { Request, Response } from "express";
import { radioSpotService } from "../services/radioSpots.service";

export const getRadioSpots = async (
  req: Request,
  res: Response
) => {

  try {

    const data =
      await radioSpotService.getAll();

    res.json(data);

  } catch {

    res.status(500).json({
      message:
        "Failed to fetch radio spots",
    });

  }

};