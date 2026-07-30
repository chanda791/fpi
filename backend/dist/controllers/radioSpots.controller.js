"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRadioSpots = void 0;
const radioSpots_service_1 = require("../services/radioSpots.service");
const getRadioSpots = async (req, res) => {
    try {
        const data = await radioSpots_service_1.radioSpotService.getAll();
        res.json(data);
    }
    catch {
        res.status(500).json({
            message: "Failed to fetch radio spots",
        });
    }
};
exports.getRadioSpots = getRadioSpots;
//# sourceMappingURL=radioSpots.controller.js.map