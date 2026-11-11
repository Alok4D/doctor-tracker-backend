import express from 'express';
import { DashboardController } from './dashboard.controller';

const router = express.Router();

router.get('/stats', DashboardController.getStats);
router.get('/patients-overview', DashboardController.getPatientsOverview);
router.get('/specialty-stats', DashboardController.getSpecialtyBreakdown);
router.get('/patients-per-doctor', DashboardController.getPatientsPerDoctor);

export const DashboardRoutes = router;

