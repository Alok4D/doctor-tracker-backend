"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const patient_model_1 = require("./patient.model");
const doctor_model_1 = require("../doctor/doctor.model");
const createPatient = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate doctor exists
    const doctor = yield doctor_model_1.Doctor.findById(payload.doctorId);
    if (!doctor) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Assigned Doctor not found');
    }
    const result = (yield patient_model_1.Patient.create(payload)).populate('doctorId', 'name specialization hospital');
    return result;
});
const getAllPatients = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, condition, doctorId, status, startDate, endDate, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', } = filters;
    const query = {};
    if (searchTerm) {
        query.$or = [
            { name: { $regex: searchTerm, $options: 'i' } },
            { phone: { $regex: searchTerm, $options: 'i' } },
            { condition: { $regex: searchTerm, $options: 'i' } },
        ];
    }
    if (condition && condition !== 'all') {
        query.condition = condition;
    }
    if (doctorId && doctorId !== 'all') {
        query.doctorId = doctorId;
    }
    if (status && status !== 'all') {
        query.status = status;
    }
    if (startDate || endDate) {
        query.createdAt = {};
        if (startDate)
            query.createdAt.$gte = new Date(startDate);
        if (endDate)
            query.createdAt.$lte = new Date(endDate);
    }
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const sortConditions = {};
    if (sortBy) {
        sortConditions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }
    else {
        sortConditions.createdAt = -1;
    }
    // Fast query with populated doctor info
    const [patients, total] = yield Promise.all([
        patient_model_1.Patient.find(query)
            .populate('doctorId', 'name specialization hospital phone email')
            .sort(sortConditions)
            .skip(skip)
            .limit(limitNumber)
            .lean(),
        patient_model_1.Patient.countDocuments(query),
    ]);
    const totalPage = Math.ceil(total / limitNumber) || 1;
    // Format response so frontend easily accesses doctorName
    const formattedPatients = patients.map((p) => {
        var _a;
        return (Object.assign(Object.assign({}, p), { id: p._id, doctorName: ((_a = p.doctorId) === null || _a === void 0 ? void 0 : _a.name) || 'Unassigned' }));
    });
    return {
        meta: {
            page: pageNumber,
            limit: limitNumber,
            total,
            totalPage,
        },
        data: formattedPatients,
    };
});
const getPatientById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const patient = yield patient_model_1.Patient.findById(id).populate('doctorId', 'name specialization hospital phone email');
    if (!patient) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Patient not found');
    }
    return Object.assign(Object.assign({}, patient.toObject()), { id: patient._id, doctorName: (_a = patient.doctorId) === null || _a === void 0 ? void 0 : _a.name });
});
const updatePatient = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const patient = yield patient_model_1.Patient.findById(id);
    if (!patient) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Patient not found');
    }
    if (payload.doctorId) {
        const doctor = yield doctor_model_1.Doctor.findById(payload.doctorId);
        if (!doctor) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Assigned Doctor not found');
        }
    }
    const result = yield patient_model_1.Patient.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    }).populate('doctorId', 'name specialization hospital');
    return result;
});
const deletePatient = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const patient = yield patient_model_1.Patient.findById(id);
    if (!patient) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Patient not found');
    }
    yield patient_model_1.Patient.findByIdAndDelete(id);
    return true;
});
exports.PatientService = {
    createPatient,
    getAllPatients,
    getPatientById,
    updatePatient,
    deletePatient,
};
