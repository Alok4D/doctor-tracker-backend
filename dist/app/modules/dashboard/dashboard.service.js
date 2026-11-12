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
const getStartDateFromRange = (range) => {
    const now = new Date();
    switch (range) {
        case 'today': {
            const start = new Date(now);
            start.setHours(0, 0, 0, 0);
            return start;
        }
        case '7d': {
            const start = new Date(now);
            start.setDate(start.getDate() - 7);
            return start;
        }
        case '30d': {
            const start = new Date(now);
            start.setDate(start.getDate() - 30);
            return start;
        }
        case '3m': {
            const start = new Date(now);
            start.setMonth(start.getMonth() - 3);
            return start;
        }
        case 'year': {
            const start = new Date(now.getFullYear(), 0, 1);
            return start;
        }
        case 'all':
        default:
            return null;
    }
};
const getDashboardStats = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (range = 'all') {
    const startDate = getStartDateFromRange(range);
    const dateFilter = startDate ? { createdAt: { $gte: startDate } } : {};
    const [totalDoctors, activeDoctors, totalPatients, admittedPatients] = yield Promise.all([
        doctor_model_1.Doctor.countDocuments(dateFilter),
        doctor_model_1.Doctor.countDocuments(Object.assign(Object.assign({}, dateFilter), { status: 'Active' })),
        patient_model_1.Patient.countDocuments(dateFilter),
        patient_model_1.Patient.countDocuments(Object.assign(Object.assign({}, dateFilter), { status: 'Admitted' })),
    ]);
    const avgPatientsPerDoctor = totalDoctors > 0 ? Number((totalPatients / totalDoctors).toFixed(1)) : 0;
    return {
        totalDoctors,
        activeDoctors,
        totalPatients,
        admittedPatients,
        avgPatientsPerDoctor,
    };
});
const getPatientsOverview = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (timeframe = '30d') {
    const startDate = getStartDateFromRange(timeframe === 'all' ? 'all' : timeframe);
    const matchStage = startDate ? [{ $match: { createdAt: { $gte: startDate } } }] : [];
    const [statusBreakdown, dateAggregation] = yield Promise.all([
        patient_model_1.Patient.aggregate([
            ...matchStage,
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                },
            },
        ]),
        patient_model_1.Patient.aggregate([
            ...matchStage,
            {
                $addFields: {
                    effectiveDate: {
                        $cond: [
                            { $and: [{ $ne: ['$admissionDate', null] }, { $ne: ['$admissionDate', ''] }] },
                            '$admissionDate',
                            { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                        ],
                    },
                },
            },
            {
                $group: {
                    _id: timeframe === 'year'
                        ? { $substr: ['$effectiveDate', 0, 7] }
                        : '$effectiveDate',
                    totalPatients: { $sum: 1 },
                    admittedPatients: {
                        $sum: { $cond: [{ $eq: ['$status', 'Admitted'] }, 1, 0] },
                    },
                    otherPatients: {
                        $sum: { $cond: [{ $ne: ['$status', 'Admitted'] }, 1, 0] },
                    },
                },
            },
            { $sort: { _id: 1 } },
            { $limit: 15 },
        ]),
    ]);
    const dateStats = dateAggregation.map((item) => ({
        date: item._id,
        totalPatients: item.totalPatients,
        admittedPatients: item.admittedPatients,
        otherPatients: item.otherPatients,
    }));
    return {
        statusBreakdown,
        dateStats,
    };
});
const getSpecialtyBreakdown = () => __awaiter(void 0, void 0, void 0, function* () {
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
    const colors = ['#143B42', '#3F97A5', '#7ABEC7', '#B5DCE1', '#94A3B8', '#CBD5E1'];
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
