"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const doctor_validation_1 = require("./doctor.validation");
const doctor_controller_1 = require("./doctor.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
// Public / Authenticated read routes
router.get('/', doctor_controller_1.DoctorController.getAllDoctors);
router.get('/:id', doctor_controller_1.DoctorController.getDoctorById);
// Specific doctor's corresponding patients (PDF Page 2 Requirements)
router.get('/:id/patients', doctor_controller_1.DoctorController.getDoctorPatients);
router.post('/:id/patients', (0, auth_1.default)('admin'), doctor_controller_1.DoctorController.addPatientToDoctor);
router.delete('/:id/patients/:patientId', (0, auth_1.default)('admin'), doctor_controller_1.DoctorController.removePatientFromDoctor);
// Protected Doctor Management
router.post('/', (0, auth_1.default)('admin'), (0, validateRequest_1.default)(doctor_validation_1.DoctorValidation.createDoctorZodSchema), doctor_controller_1.DoctorController.createDoctor);
router.patch('/:id', (0, auth_1.default)('admin'), (0, validateRequest_1.default)(doctor_validation_1.DoctorValidation.updateDoctorZodSchema), doctor_controller_1.DoctorController.updateDoctor);
router.delete('/:id', (0, auth_1.default)('admin'), doctor_controller_1.DoctorController.deleteDoctor);
exports.DoctorRoutes = router;
