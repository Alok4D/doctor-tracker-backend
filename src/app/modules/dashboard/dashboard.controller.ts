import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { DashboardService } from './dashboard.service';

const getStats = catchAsync(async (req, res) => {
  const range = (req.query.range as string) || 'all';
  const result = await DashboardService.getDashboardStats(range);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Dashboard stats retrieved successfully!',
    data: result,
  });
});

const getPatientsOverview = catchAsync(async (req, res) => {
  const timeframe = (req.query.timeframe as string) || '30d';
  const result = await DashboardService.getPatientsOverview(timeframe);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Date-based patient statistics retrieved successfully!',
    data: result,
  });
});

const getSpecialtyBreakdown = catchAsync(async (req, res) => {
  const result = await DashboardService.getSpecialtyBreakdown();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Doctors by specialty breakdown retrieved successfully!',
    data: result,
  });
});

const getPatientsPerDoctor = catchAsync(async (req, res) => {
  const result = await DashboardService.getPatientsPerDoctor();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Patients per doctor analytics retrieved successfully!',
    data: result,
  });
});

export const DashboardController = {
  getStats,
  getPatientsOverview,
  getSpecialtyBreakdown,
  getPatientsPerDoctor,
};
