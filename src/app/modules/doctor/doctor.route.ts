import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { DoctorValidation } from './doctor.validation';
import { DoctorController } from './doctor.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

// Public / Authenticated read routes
router.get('/', DoctorController.getAllDoctors);
router.get('/:id', DoctorController.getDoctorById);

// Specific doctor's corresponding patients (PDF Page 2 Requirements)
router.get('/:id/patients', DoctorController.getDoctorPatients);
router.post(
  '/:id/patients',
  auth('admin'),
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
  validateRequest(DoctorValidation.createDoctorZodSchema),
  DoctorController.createDoctor,
);

router.patch(
  '/:id',
  auth('admin'),
  validateRequest(DoctorValidation.updateDoctorZodSchema),
  DoctorController.updateDoctor,
);

router.delete('/:id', auth('admin'), DoctorController.deleteDoctor);

export const DoctorRoutes = router;

