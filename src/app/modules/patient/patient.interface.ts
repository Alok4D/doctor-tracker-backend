import { Types } from 'mongoose';

export interface IPatient {
  _id?: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  condition: string;
  phone: string;
  doctorId: Types.ObjectId | string;
  status: 'Admitted' | 'Discharged' | 'Followup' | 'Transferred';
  admissionDate?: string;
  avatarUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPatientFilterOptions {
  searchTerm?: string;
  condition?: string;
  doctorId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

