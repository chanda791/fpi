import { Router } from "express";

import {
  getHomepage,
  getHomepageSection,
  updateHomepageSection,
} from "../controllers/homepage.controller";

const router = Router();

router.get("/", getHomepage);

router.get("/:section", getHomepageSection);

router.put("/:section", updateHomepageSection);

export default router;