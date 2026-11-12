import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Patient } from './patient.model';
import { IPatient, IPatientFilterOptions } from './patient.interface';
import { Doctor } from '../doctor/doctor.model';

const createPatient = async (payload: IPatient): Promise<IPatient> => {
  // Validate doctor exists
  const doctor = await Doctor.findById(payload.doctorId);
  if (!doctor) {
    throw new AppError(httpStatus.NOT_FOUND, 'Assigned Doctor not found');
  }

  const result = (await Patient.create(payload)).populate(
    'doctorId',
    'name specialization hospital',
  );
  return result;
};

const getAllPatients = async (filters: IPatientFilterOptions) => {
  const {
    searchTerm,
    condition,
    doctorId,
    status,
    startDate,
    endDate,
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = filters;

  const query: any = {};

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
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const sortConditions: any = {};
  if (sortBy) {
    sortConditions[sortBy] = sortOrder === 'asc' ? 1 : -1;
  } else {
    sortConditions.createdAt = -1;
  }

  // Fast query with populated doctor info
  const [patients, total] = await Promise.all([
    Patient.find(query)
      .populate('doctorId', 'name specialization hospital phone email avatarUrl')
      .sort(sortConditions)
      .skip(skip)
      .limit(limitNumber)
      .lean(),
    Patient.countDocuments(query),
  ]);

  const totalPage = Math.ceil(total / limitNumber) || 1;

  // Format response so frontend easily accesses doctorName
  const formattedPatients = patients.map((p: any) => ({
    ...p,
    id: p._id,
    doctorName: p.doctorId?.name || 'Unassigned',
  }));

  return {
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPage,
    },
    data: formattedPatients,
  };
};

const getPatientById = async (id: string) => {
  const patient = await Patient.findById(id).populate(
    'doctorId',
    'name specialization hospital phone email avatarUrl',
  );
  if (!patient) {
    throw new AppError(httpStatus.NOT_FOUND, 'Patient not found');
  }

  return {
    ...(patient.toObject() as any),
    id: patient._id,
    doctorName: (patient.doctorId as any)?.name,
  };
};

const updatePatient = async (id: string, payload: Partial<IPatient>) => {
  const patient = await Patient.findById(id);
  if (!patient) {
    throw new AppError(httpStatus.NOT_FOUND, 'Patient not found');
  }

  if (payload.doctorId) {
    const doctor = await Doctor.findById(payload.doctorId);
    if (!doctor) {
      throw new AppError(httpStatus.NOT_FOUND, 'Assigned Doctor not found');
    }
  }

  const result = await Patient.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).populate('doctorId', 'name specialization hospital');

  return result;
};

const deletePatient = async (id: string) => {
  const patient = await Patient.findById(id);
  if (!patient) {
    throw new AppError(httpStatus.NOT_FOUND, 'Patient not found');
  }

  await Patient.findByIdAndDelete(id);
  return true;
};

export const PatientService = {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
};
