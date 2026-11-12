import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { parseFormDataWithOptionalImage } from '../../middlewares/upload';
import { DoctorValidation } from './doctor.validation';
import { DoctorController } from './doctor.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

// Authenticated Admin Read Routes
router.get('/', auth('admin'), DoctorController.getAllDoctors);
router.get('/:id', auth('admin'), DoctorController.getDoctorById);

// Specific doctor's corresponding patients
router.get('/:id/patients', auth('admin'), DoctorController.getDoctorPatients);
router.post(
  '/:id/patients',
  auth('admin'),
  parseFormDataWithOptionalImage('patients'),
  DoctorController.addPatientToDoctor,
);
router.delete(
  '/:id/patients/:patientId',
  auth('admin'),
  DoctorController.removePatientFromDoctor,
);

// Protected Doctor Management
router.post(
  '/',
  auth('admin'),
  parseFormDataWithOptionalImage('doctors'),
  validateRequest(DoctorValidation.createDoctorZodSchema),
  DoctorController.createDoctor,
);

router.patch(
  '/:id',
  auth('admin'),
  parseFormDataWithOptionalImage('doctors'),
  validateRequest(DoctorValidation.updateDoctorZodSchema),
  DoctorController.updateDoctor,
);

router.delete('/:id', auth('admin'), DoctorController.deleteDoctor);

export const DoctorRoutes = router;
