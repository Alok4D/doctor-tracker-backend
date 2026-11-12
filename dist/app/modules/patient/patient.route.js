"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const upload_1 = require("../../middlewares/upload");
const patient_validation_1 = require("./patient.validation");
const patient_controller_1 = require("./patient.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)('admin'), patient_controller_1.PatientController.getAllPatients);
router.get('/:id', (0, auth_1.default)('admin'), patient_controller_1.PatientController.getPatientById);
router.post('/', (0, auth_1.default)('admin'), (0, upload_1.parseFormDataWithOptionalImage)('patients'), (0, validateRequest_1.default)(patient_validation_1.PatientValidation.createPatientZodSchema), patient_controller_1.PatientController.createPatient);
router.patch('/:id', (0, auth_1.default)('admin'), (0, upload_1.parseFormDataWithOptionalImage)('patients'), (0, validateRequest_1.default)(patient_validation_1.PatientValidation.updatePatientZodSchema), patient_controller_1.PatientController.updatePatient);
router.delete('/:id', (0, auth_1.default)('admin'), patient_controller_1.PatientController.deletePatient);
exports.PatientRoutes = router;
