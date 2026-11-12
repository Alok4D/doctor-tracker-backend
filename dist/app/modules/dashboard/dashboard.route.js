"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardRoutes = void 0;
const express_1 = __importDefault(require("express"));
const dashboard_controller_1 = require("./dashboard.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.get('/stats', (0, auth_1.default)('admin'), dashboard_controller_1.DashboardController.getStats);
router.get('/patients-overview', (0, auth_1.default)('admin'), dashboard_controller_1.DashboardController.getPatientsOverview);
router.get('/specialty-stats', (0, auth_1.default)('admin'), dashboard_controller_1.DashboardController.getSpecialtyBreakdown);
router.get('/patients-per-doctor', (0, auth_1.default)('admin'), dashboard_controller_1.DashboardController.getPatientsPerDoctor);
exports.DashboardRoutes = router;
