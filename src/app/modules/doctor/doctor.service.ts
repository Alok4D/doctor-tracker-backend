import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Doctor } from './doctor.model';
import { IDoctor, IDoctorFilterOptions } from './doctor.interface';
import { Patient } from '../patient/patient.model';

const createDoctor = async (payload: IDoctor): Promise<IDoctor> => {
  const existingDoctor = await Doctor.findOne({ email: payload.email });
  if (existingDoctor) {
    throw new AppError(
      httpStatus.CONFLICT,
      'A doctor already exists with this email address',
    );
  }

  const result = await Doctor.create(payload);
  return result;
};

const getAllDoctors = async (filters: IDoctorFilterOptions) => {
  const {
    searchTerm,
    specialization,
    hospital,
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
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const sortDirection = sortOrder === 'asc' ? 1 : -1;
  const sortStage: any = {};
  if (sortBy) {
    sortStage[sortBy] = sortDirection;
  } else {
    sortStage.createdAt = -1;
  }

  // Optimize query: get doctors and calculate patient count per doctor using aggregation
  const [doctors, total] = await Promise.all([
    Doctor.aggregate([
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
    Doctor.countDocuments(query),
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
};

const getDoctorById = async (id: string) => {
  const doctor = await Doctor.findById(id);
  if (!doctor) {
    throw new AppError(httpStatus.NOT_FOUND, 'Doctor not found');
  }

  const patients = await Patient.find({ doctorId: id }).sort({ createdAt: -1 });

  return {
    doctor,
    patients,
    patientCount: patients.length,
  };
};

const getDoctorPatients = async (doctorId: string) => {
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    throw new AppError(httpStatus.NOT_FOUND, 'Doctor not found');
  }

  const patients = await Patient.find({ doctorId }).sort({ createdAt: -1 });
  return patients;
};

const addPatientToDoctor = async (doctorId: string, patientData: any) => {
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    throw new AppError(httpStatus.NOT_FOUND, 'Doctor not found');
  }

  const newPatient = await Patient.create({
    ...patientData,
    doctorId,
  });

  return newPatient;
};

const removePatientFromDoctor = async (
  doctorId: string,
  patientId: string,
) => {
  const patient = await Patient.findOne({ _id: patientId, doctorId });
  if (!patient) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Patient not found under this doctor',
    );
  }

  await Patient.findByIdAndDelete(patientId);
  return true;
};

const updateDoctor = async (id: string, payload: Partial<IDoctor>) => {
  const doctor = await Doctor.findById(id);
  if (!doctor) {
    throw new AppError(httpStatus.NOT_FOUND, 'Doctor not found');
  }

  const result = await Doctor.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteDoctor = async (id: string) => {
  const doctor = await Doctor.findById(id);
  if (!doctor) {
    throw new AppError(httpStatus.NOT_FOUND, 'Doctor not found');
  }

  // Also remove or unlink corresponding patients
  await Promise.all([
    Doctor.findByIdAndDelete(id),
    Patient.deleteMany({ doctorId: id }),
  ]);

  return true;
};

export const DoctorService = {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  getDoctorPatients,
  addPatientToDoctor,
  removePatientFromDoctor,
  updateDoctor,
  deleteDoctor,
};
