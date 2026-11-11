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
exports.DoctorService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const doctor_model_1 = require("./doctor.model");
const patient_model_1 = require("../patient/patient.model");
const createDoctor = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingDoctor = yield doctor_model_1.Doctor.findOne({ email: payload.email });
    if (existingDoctor) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, 'A doctor already exists with this email address');
    }
    const result = yield doctor_model_1.Doctor.create(payload);
    return result;
});
const getAllDoctors = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, specialization, hospital, status, startDate, endDate, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', } = filters;
    const query = {};
    if (searchTerm) {
        query.$or = [
            { name: { $regex: searchTerm, $options: 'i' } },
            { specialization: { $regex: searchTerm, $options: 'i' } },
            { hospital: { $regex: searchTerm, $options: 'i' } },
            { email: { $regex: searchTerm, $options: 'i' } },
        ];
    }
    if (specialization && specialization !== 'all') {
        query.specialization = specialization;
    }
    if (hospital && hospital !== 'all') {
        query.hospital = hospital;
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
    const sortDirection = sortOrder === 'asc' ? 1 : -1;
    const sortStage = {};
    if (sortBy) {
        sortStage[sortBy] = sortDirection;
    }
    else {
        sortStage.createdAt = -1;
    }
    // Optimize query: get doctors and calculate patient count per doctor using aggregation
    const [doctors, total] = yield Promise.all([
        doctor_model_1.Doctor.aggregate([
            { $match: query },
            { $sort: sortStage },
            { $skip: skip },
            { $limit: limitNumber },
            {
                $lookup: {
                    from: 'patients',
                    localField: '_id',
                    foreignField: 'doctorId',
                    as: 'patients',
                },
            },
            {
                $addFields: {
                    patientCount: { $size: '$patients' },
                    id: '$_id',
                },
            },
            {
                $project: {
                    patients: 0,
                },
            },
        ]),
        doctor_model_1.Doctor.countDocuments(query),
    ]);
    const totalPage = Math.ceil(total / limitNumber) || 1;
    return {
        meta: {
            page: pageNumber,
            limit: limitNumber,
            total,
            totalPage,
        },
        data: doctors,
    };
});
const getDoctorById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const doctor = yield doctor_model_1.Doctor.findById(id);
    if (!doctor) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Doctor not found');
    }
    const patients = yield patient_model_1.Patient.find({ doctorId: id }).sort({ createdAt: -1 });
    return {
        doctor,
        patients,
        patientCount: patients.length,
    };
});
const getDoctorPatients = (doctorId) => __awaiter(void 0, void 0, void 0, function* () {
    const doctor = yield doctor_model_1.Doctor.findById(doctorId);
    if (!doctor) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Doctor not found');
    }
    const patients = yield patient_model_1.Patient.find({ doctorId }).sort({ createdAt: -1 });
    return patients;
});
const addPatientToDoctor = (doctorId, patientData) => __awaiter(void 0, void 0, void 0, function* () {
    const doctor = yield doctor_model_1.Doctor.findById(doctorId);
    if (!doctor) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Doctor not found');
    }
    const newPatient = yield patient_model_1.Patient.create(Object.assign(Object.assign({}, patientData), { doctorId }));
    return newPatient;
});
const removePatientFromDoctor = (doctorId, patientId) => __awaiter(void 0, void 0, void 0, function* () {
    const patient = yield patient_model_1.Patient.findOne({ _id: patientId, doctorId });
    if (!patient) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Patient not found under this doctor');
    }
    yield patient_model_1.Patient.findByIdAndDelete(patientId);
    return true;
});
const updateDoctor = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const doctor = yield doctor_model_1.Doctor.findById(id);
    if (!doctor) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Doctor not found');
    }
    const result = yield doctor_model_1.Doctor.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const deleteDoctor = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const doctor = yield doctor_model_1.Doctor.findById(id);
    if (!doctor) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Doctor not found');
    }
    // Also remove or unlink corresponding patients
    yield Promise.all([
        doctor_model_1.Doctor.findByIdAndDelete(id),
        patient_model_1.Patient.deleteMany({ doctorId: id }),
    ]);
    return true;
});
exports.DoctorService = {
    createDoctor,
    getAllDoctors,
    getDoctorById,
    getDoctorPatients,
    addPatientToDoctor,
    removePatientFromDoctor,
    updateDoctor,
    deleteDoctor,
};
