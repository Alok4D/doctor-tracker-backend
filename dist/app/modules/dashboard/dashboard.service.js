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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const doctor_model_1 = require("../doctor/doctor.model");
const patient_model_1 = require("../patient/patient.model");
const getDashboardStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const [totalDoctors, activeDoctors, totalPatients, admittedPatients] = yield Promise.all([
        doctor_model_1.Doctor.countDocuments(),
        doctor_model_1.Doctor.countDocuments({ status: 'Active' }),
        patient_model_1.Patient.countDocuments(),
        patient_model_1.Patient.countDocuments({ status: 'Admitted' }),
    ]);
    const avgPatientsPerDoctor = totalDoctors > 0 ? Number((totalPatients / totalDoctors).toFixed(1)) : 0;
    return {
        totalDoctors,
        activeDoctors,
        totalPatients,
        admittedPatients,
        avgPatientsPerDoctor,
        // Demo metrics for visual completeness
        appointments: 892,
        totalEarnings: '$55,000',
    };
});
const getPatientsOverview = () => __awaiter(void 0, void 0, void 0, function* () {
    // Aggregation pipeline: group by week/admission date to get trends
    const trend = yield patient_model_1.Patient.aggregate([
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
            },
        },
    ]);
    // Sparkline weekly data
    return {
        statusBreakdown: trend,
        weeklyOverview: [
            { week: 'Week 1', newPatients: 70, returningPatients: 42 },
            { week: 'Week 2', newPatients: 120, returningPatients: 90 },
            { week: 'Week 3', newPatients: 155, returningPatients: 118 },
            { week: 'Week 4', newPatients: 172, returningPatients: 105 },
        ],
    };
});
const getSpecialtyBreakdown = () => __awaiter(void 0, void 0, void 0, function* () {
    // Aggregation pipeline: group doctors by specialization and count
    const specialtyStats = yield doctor_model_1.Doctor.aggregate([
        {
            $group: {
                _id: '$specialization',
                count: { $sum: 1 },
            },
        },
        {
            $project: {
                specialty: '$_id',
                count: 1,
                _id: 0,
            },
        },
        { $sort: { count: -1 } },
    ]);
    const total = specialtyStats.reduce((acc, curr) => acc + curr.count, 0);
    const colors = ['#2563eb', '#10b981', '#a855f7', '#f97316', '#06b6d4', '#eab308'];
    const formatted = specialtyStats.map((item, index) => ({
        name: item.specialty,
        count: item.count,
        percentage: total > 0 ? `${Math.round((item.count / total) * 100)}%` : '0%',
        color: colors[index % colors.length],
    }));
    return {
        totalDoctors: total,
        breakdown: formatted,
    };
});
const getPatientsPerDoctor = () => __awaiter(void 0, void 0, void 0, function* () {
    // Aggregation pipeline: Count how many patients each doctor has
    const result = yield doctor_model_1.Doctor.aggregate([
        {
            $lookup: {
                from: 'patients',
                localField: '_id',
                foreignField: 'doctorId',
                as: 'patients',
            },
        },
        {
            $project: {
                name: 1,
                specialization: 1,
                hospital: 1,
                patientCount: { $size: '$patients' },
            },
        },
        { $sort: { patientCount: -1 } },
        { $limit: 10 },
    ]);
    return result;
});
exports.DashboardService = {
    getDashboardStats,
    getPatientsOverview,
    getSpecialtyBreakdown,
    getPatientsPerDoctor,
};
