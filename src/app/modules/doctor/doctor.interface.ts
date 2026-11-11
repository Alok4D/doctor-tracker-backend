export interface IDoctor {
  _id?: string;
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
  status: 'Active' | 'Inactive';
  avatarUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IDoctorFilterOptions {
  searchTerm?: string;
  specialization?: string;
  hospital?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

