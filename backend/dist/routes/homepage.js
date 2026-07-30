"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const homepage_controller_1 = require("../controllers/homepage.controller");
const router = (0, express_1.Router)();
router.get("/", homepage_controller_1.getHomepage);
router.get("/:section", homepage_controller_1.getHomepageSection);
router.put("/:section", homepage_controller_1.updateHomepageSection);
exports.default = router;
//# sourceMappingURL=homepage.js.map