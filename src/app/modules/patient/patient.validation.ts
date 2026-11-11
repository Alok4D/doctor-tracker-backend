import { z } from 'zod';

const createPatientZodSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Patient name must be at least 2 characters'),
    age: z.number().min(0, 'Age cannot be negative').max(130, 'Invalid age'),
    gender: z.enum(['Male', 'Female', 'Other']),
    condition: z.string().min(2, 'Condition is required'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    doctorId: z.string().min(1, 'Assigned doctor is required'),
    status: z
      .enum(['Admitted', 'Discharged', 'Followup', 'Transferred'])
      .optional(),
    admissionDate: z.string().optional(),
    avatarUrl: z.string().optional(),
  }),
});

const updatePatientZodSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    age: z.number().min(0).max(130).optional(),
    gender: z.enum(['Male', 'Female', 'Other']).optional(),
    condition: z.string().min(2).optional(),
    phone: z.string().min(10).optional(),
    doctorId: z.string().optional(),
    status: z
      .enum(['Admitted', 'Discharged', 'Followup', 'Transferred'])
      .optional(),
    admissionDate: z.string().optional(),
    avatarUrl: z.string().optional(),
  }),
});

export const PatientValidation = {
  createPatientZodSchema,
  updatePatientZodSchema,
};
