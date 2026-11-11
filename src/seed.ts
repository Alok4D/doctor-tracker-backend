import mongoose from 'mongoose';
import config from './app/config';
import { User } from './app/modules/auth/auth.model';
import { Doctor } from './app/modules/doctor/doctor.model';
import { Patient } from './app/modules/patient/patient.model';

const initialDoctors = [
  {
    name: 'Dr. Nazar Becks',
    specialization: 'Gynecologist',
    hospital: 'City Central Hospital',
    phone: '+880 1711 234567',
    email: 'nazar.becks@careguide.com',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=120&auto=format&fit=crop&q=80',
  },
  {
    name: 'Dr. John Darwin',
    specialization: 'Radiologist & ECG',
    hospital: 'Apex Diagnostic Center',
    phone: '+880 1712 345678',
    email: 'john.darwin@careguide.com',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=120&auto=format&fit=crop&q=80',
  },
  {
    name: 'Dr. Alex Hales',
    specialization: 'General Physician',
    hospital: 'Care Guide Specialized Hospital',
    phone: '+880 1713 456789',
    email: 'alex.hales@careguide.com',
    status: 'Inactive',
    avatarUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=120&auto=format&fit=crop&q=80',
  },
  {
    name: 'Dr. Sarah Jenkins',
    specialization: 'Cardiologist',
    hospital: 'National Heart Foundation',
    phone: '+880 1714 567890',
    email: 'sarah.jenkins@careguide.com',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1594824813575-b65076cf4722?w=120&auto=format&fit=crop&q=80',
  },
  {
    name: 'Dr. Merina Farah',
    specialization: 'Neurologist',
    hospital: 'Neuroscience Medical Institute',
    phone: '+880 1715 678901',
    email: 'merina.farah@careguide.com',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&auto=format&fit=crop&q=80',
  },
  {
    name: 'Dr. Tariq Ahmed',
    specialization: 'Orthopedic Surgeon',
    hospital: 'Metropolitan Trauma Center',
    phone: '+880 1716 789012',
    email: 'tariq.ahmed@careguide.com',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=120&auto=format&fit=crop&q=80',
  },
];

async function seed() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(config.database_url as string);
    console.log('Connected to MongoDB Atlas successfully.');

    // 1. Seed Admin
    const existingAdmin = await User.findOne({ email: 'admin@doctor-tracker.com' });
    if (!existingAdmin) {
      await User.create({
        name: 'Admin',
        email: 'admin@doctor-tracker.com',
        password: config.default_password || 'password123',
        role: 'admin',
      });
      console.log('Default Admin created: admin@doctor-tracker.com / password123');
    } else {
      console.log('Admin already exists.');
    }

    // 2. Seed Doctors
    for (const doc of initialDoctors) {
      const exists = await Doctor.findOne({ email: doc.email });
      if (!exists) {
        await Doctor.create(doc);
      }
    }
    console.log('Doctors checked/seeded.');

    // 3. Seed Patients linked to Doctors
    const doctors = await Doctor.find();
    if (doctors.length > 0) {
      const patientCount = await Patient.countDocuments();
      if (patientCount === 0) {
        const samplePatients = [
          {
            name: 'Sarah Ahmed',
            age: 34,
            gender: 'Female',
            condition: 'Gynecologist Consultation',
            phone: '+880 1812 112233',
            doctorId: doctors[0]._id,
            status: 'Admitted',
            admissionDate: '2026-03-01',
            avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
          },
          {
            name: 'Merina Farah',
            age: 45,
            gender: 'Female',
            condition: 'Radiologist & ECG Scan',
            phone: '+880 1813 223344',
            doctorId: doctors[1]._id,
            status: 'Admitted',
            admissionDate: '2026-03-03',
            avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
          },
          {
            name: 'John Doe',
            age: 29,
            gender: 'Male',
            condition: 'General Physician Checkup',
            phone: '+880 1814 334455',
            doctorId: doctors[2]._id,
            status: 'Followup',
            admissionDate: '2026-03-05',
            avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
          },
          {
            name: 'Rahim Chowdhury',
            age: 58,
            gender: 'Male',
            condition: 'Cardiovascular Disease',
            phone: '+880 1815 445566',
            doctorId: doctors[3]._id,
            status: 'Admitted',
            admissionDate: '2026-03-10',
            avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
          },
          {
            name: 'Farhana Islam',
            age: 41,
            gender: 'Female',
            condition: 'Diabetes Type 2',
            phone: '+880 1816 556677',
            doctorId: doctors[2]._id,
            status: 'Discharged',
            admissionDate: '2026-03-12',
            avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
          },
          {
            name: 'Kamal Hossain',
            age: 62,
            gender: 'Male',
            condition: 'Chronic Migraine',
            phone: '+880 1817 667788',
            doctorId: doctors[4]._id,
            status: 'Followup',
            admissionDate: '2026-03-15',
            avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
          },
          {
            name: 'Tania Sultana',
            age: 26,
            gender: 'Female',
            condition: 'Post-Op Recovery',
            phone: '+880 1818 778899',
            doctorId: doctors[5]._id,
            status: 'Transferred',
            admissionDate: '2026-03-18',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
          },
          {
            name: 'Anisur Rahman',
            age: 50,
            gender: 'Male',
            condition: 'Hypertension',
            phone: '+880 1819 889900',
            doctorId: doctors[3]._id,
            status: 'Admitted',
            admissionDate: '2026-03-22',
            avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80',
          },
        ];

        await Patient.insertMany(samplePatients);
        console.log('Sample patients seeded successfully.');
      }
    }

    console.log('Database seeding process completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during database seed:', error);
    process.exit(1);
  }
}

seed();

