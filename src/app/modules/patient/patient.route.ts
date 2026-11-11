import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { PatientValidation } from './patient.validation';
import { PatientController } from './patient.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.get('/', PatientController.getAllPatients);
router.get('/:id', PatientController.getPatientById);

router.post(
  '/',
  auth('admin'),
  validateRequest(PatientValidation.createPatientZodSchema),
  PatientController.createPatient,
);

router.patch(
  '/:id',
  auth('admin'),
  validateRequest(PatientValidation.updatePatientZodSchema),
  PatientController.updatePatient,
);

router.delete('/:id', auth('admin'), PatientController.deletePatient);

export const PatientRoutes = router;

