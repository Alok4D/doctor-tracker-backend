import { z } from 'zod';

const createDoctorZodSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    specialization: z.string().min(2, 'Specialization is required'),
    hospital: z.string().min(2, 'Hospital is required'),
    phone: z.string().min(10, 'Phone must be at least 10 digits'),
    email: z.string().email('Invalid email address'),
    status: z.enum(['Active', 'Inactive']).optional(),
    avatarUrl: z.string().optional(),
  }),
});

const updateDoctorZodSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    specialization: z.string().optional(),
    hospital: z.string().optional(),
    phone: z.string().min(10).optional(),
    email: z.string().email().optional(),
    status: z.enum(['Active', 'Inactive']).optional(),
    avatarUrl: z.string().optional(),
  }),
});

export const DoctorValidation = {
  createDoctorZodSchema,
  updateDoctorZodSchema,
};
