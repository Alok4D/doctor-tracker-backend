import express from 'express';
import { DashboardController } from './dashboard.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.get('/stats', auth('admin'), DashboardController.getStats);
router.get('/patients-overview', auth('admin'), DashboardController.getPatientsOverview);
router.get('/specialty-stats', auth('admin'), DashboardController.getSpecialtyBreakdown);
router.get('/patients-per-doctor', auth('admin'), DashboardController.getPatientsPerDoctor);

export const DashboardRoutes = router;
