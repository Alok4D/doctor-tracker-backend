"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientValidation = void 0;
const zod_1 = require("zod");
const createPatientZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, 'Patient name must be at least 2 characters'),
        age: zod_1.z.number().min(0, 'Age cannot be negative').max(130, 'Invalid age'),
        gender: zod_1.z.enum(['Male', 'Female', 'Other']),
        condition: zod_1.z.string().min(2, 'Condition is required'),
        phone: zod_1.z.string().min(10, 'Phone number must be at least 10 digits'),
        doctorId: zod_1.z.string().min(1, 'Assigned doctor is required'),
        status: zod_1.z
            .enum(['Admitted', 'Discharged', 'Followup', 'Transferred'])
            .optional(),
        admissionDate: zod_1.z.string().optional(),
        avatarUrl: zod_1.z.string().optional(),
    }),
});
const updatePatientZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2).optional(),
        age: zod_1.z.number().min(0).max(130).optional(),
        gender: zod_1.z.enum(['Male', 'Female', 'Other']).optional(),
        condition: zod_1.z.string().min(2).optional(),
        phone: zod_1.z.string().min(10).optional(),
        doctorId: zod_1.z.string().optional(),
        status: zod_1.z
            .enum(['Admitted', 'Discharged', 'Followup', 'Transferred'])
            .optional(),
        admissionDate: zod_1.z.string().optional(),
        avatarUrl: zod_1.z.string().optional(),
    }),
});
exports.PatientValidation = {
    createPatientZodSchema,
    updatePatientZodSchema,
};
