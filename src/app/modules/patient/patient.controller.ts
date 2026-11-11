import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PatientService } from './patient.service';

const createPatient = catchAsync(async (req, res) => {
  const result = await PatientService.createPatient(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Patient registered successfully!',
    data: result,
  });
});

const getAllPatients = catchAsync(async (req, res) => {
  const result = await PatientService.getAllPatients(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Patients retrieved successfully!',
    meta: result.meta,
    data: result.data,
  });
});

const getPatientById = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const result = await PatientService.getPatientById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Patient details retrieved successfully!',
    data: result,
  });
});

const updatePatient = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const result = await PatientService.updatePatient(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Patient record updated successfully!',
    data: result,
  });
});

const deletePatient = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  await PatientService.deletePatient(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Patient record deleted successfully!',
    data: null,
  });
});

export const PatientController = {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
};
