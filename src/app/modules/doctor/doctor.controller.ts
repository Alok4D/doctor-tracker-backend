import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { DoctorService } from './doctor.service';

const createDoctor = catchAsync(async (req, res) => {
  const result = await DoctorService.createDoctor(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Doctor created successfully!',
    data: result,
  });
});

const getAllDoctors = catchAsync(async (req, res) => {
  const result = await DoctorService.getAllDoctors(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Doctors retrieved successfully!',
    meta: result.meta,
    data: result.data,
  });
});

const getDoctorById = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const result = await DoctorService.getDoctorById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Doctor profile retrieved successfully!',
    data: result,
  });
});

const getDoctorPatients = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const result = await DoctorService.getDoctorPatients(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Doctor patients retrieved successfully!',
    data: result,
  });
});

const addPatientToDoctor = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const result = await DoctorService.addPatientToDoctor(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Patient added under doctor successfully!',
    data: result,
  });
});

const removePatientFromDoctor = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const patientId = req.params.patientId as string;
  await DoctorService.removePatientFromDoctor(id, patientId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Patient removed from doctor successfully!',
    data: null,
  });
});

const updateDoctor = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const result = await DoctorService.updateDoctor(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Doctor updated successfully!',
    data: result,
  });
});

const deleteDoctor = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  await DoctorService.deleteDoctor(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Doctor deleted successfully!',
    data: null,
  });
});

export const DoctorController = {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  getDoctorPatients,
  addPatientToDoctor,
  removePatientFromDoctor,
  updateDoctor,
  deleteDoctor,
};
