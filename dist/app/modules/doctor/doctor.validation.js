"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorValidation = void 0;
const zod_1 = require("zod");
const createDoctorZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
        specialization: zod_1.z.string().min(2, 'Specialization is required'),
        hospital: zod_1.z.string().min(2, 'Hospital is required'),
        phone: zod_1.z.string().min(10, 'Phone must be at least 10 digits'),
        email: zod_1.z.string().email('Invalid email address'),
        status: zod_1.z.enum(['Active', 'Inactive']).optional(),
        avatarUrl: zod_1.z.string().optional(),
    }),
});
const updateDoctorZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2).optional(),
        specialization: zod_1.z.string().optional(),
        hospital: zod_1.z.string().optional(),
        phone: zod_1.z.string().min(10).optional(),
        email: zod_1.z.string().email().optional(),
        status: zod_1.z.enum(['Active', 'Inactive']).optional(),
        avatarUrl: zod_1.z.string().optional(),
    }),
});
exports.DoctorValidation = {
    createDoctorZodSchema,
    updateDoctorZodSchema,
};
