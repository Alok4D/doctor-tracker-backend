import mongoose from 'mongoose';
import config from './app/config';
import { User } from './app/modules/auth/auth.model';
import { Doctor } from './app/modules/doctor/doctor.model';
import { Patient } from './app/modules/patient/patient.model';

const initialUsers = [
  {
    name: 'Admin',
    email: 'admin@doctor-tracker.com',
    password: config.default_password || 'password123',
    role: 'admin',
  },
  {
    name: 'Dr. Supervisor Admin',
    email: 'supervisor@doctor-tracker.com',
    password: config.default_password || 'password123',
    role: 'admin',
  },
];

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
  {
    name: 'Dr. Ayesha Siddiqua',
    specialization: 'Pediatrician',
    hospital: 'Dhaka Shishu Medical Hospital',
    phone: '+880 1717 890123',
    email: 'ayesha.siddiqua@careguide.com',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=120&auto=format&fit=crop&q=80',
  },
  {
    name: 'Dr. Rafiqul Islam',
    specialization: 'Dermatologist',
    hospital: 'Skin & Laser Care Clinic',
    phone: '+880 1718 901234',
    email: 'rafiqul.islam@careguide.com',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1618498082410-b4aa22193b38?w=120&auto=format&fit=crop&q=80',
  },
  {
    name: 'Dr. Nusrat Jahan',
    specialization: 'Oncologist',
    hospital: 'National Cancer Research Institute',
    phone: '+880 1719 012345',
    email: 'nusrat.jahan@careguide.com',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=120&auto=format&fit=crop&q=80',
  },
  {
    name: 'Dr. Mahbubur Rahman',
    specialization: 'Psychiatrist',
    hospital: 'Mind & Wellness Medical Center',
    phone: '+880 1720 123456',
    email: 'mahbubur.rahman@careguide.com',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&auto=format&fit=crop&q=80',
  },
  {
    name: 'Dr. Farzana Kabir',
    specialization: 'Cardiologist',
    hospital: 'Care Guide Heart Institute',
    phone: '+880 1721 234567',
    email: 'farzana.kabir@careguide.com',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
  },
  {
    name: 'Dr. Tanvir Mahmud',
    specialization: 'General Physician',
    hospital: 'United Care Medical Hospital',
    phone: '+880 1722 345678',
    email: 'tanvir.mahmud@careguide.com',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
  },
  {
    name: 'Dr. Sabrina Yasmin',
    specialization: 'Neurologist',
    hospital: 'City Central Hospital',
    phone: '+880 1723 456789',
    email: 'sabrina.yasmin@careguide.com',
    status: 'Inactive',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
  },
  {
    name: 'Dr. Imran Hossain',
    specialization: 'Pediatrician',
    hospital: 'Greenview Children Clinic',
    phone: '+880 1724 567890',
    email: 'imran.hossain@careguide.com',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
  },
];

async function seed() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(config.database_url as string);
    console.log('Connected to MongoDB Atlas successfully.');

    // 1. Seed Users
    for (const user of initialUsers) {
      const exists = await User.findOne({ email: user.email });
      if (!exists) {
        await User.create(user);
        console.log(`User created: ${user.email}`);
      }
    }

    // 2. Seed Doctors
    for (const doc of initialDoctors) {
      const exists = await Doctor.findOne({ email: doc.email });
      if (!exists) {
        await Doctor.create(doc);
      }
    }
    const doctors = await Doctor.find().sort({ createdAt: 1 });
    console.log(`Total Doctors in DB: ${doctors.length}`);

    // 3. Seed Patients linked to Doctors
    if (doctors.length > 0) {
      const getDocId = (idx: number) => doctors[idx % doctors.length]._id;

      const samplePatients = [
        {
          name: 'Sarah Ahmed',
          age: 34,
          gender: 'Female',
          condition: 'General Checkup',
          phone: '+880 1812 112233',
          doctorId: getDocId(0),
          status: 'Admitted',
          admissionDate: '2026-03-01',
          avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
        },
        {
          name: 'Merina Farah',
          age: 45,
          gender: 'Female',
          condition: 'Cardiovascular Disease',
          phone: '+880 1813 223344',
          doctorId: getDocId(1),
          status: 'Admitted',
          admissionDate: '2026-03-03',
          avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
        },
        {
          name: 'John Doe',
          age: 29,
          gender: 'Male',
          condition: 'General Checkup',
          phone: '+880 1814 334455',
          doctorId: getDocId(2),
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
          doctorId: getDocId(3),
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
          doctorId: getDocId(2),
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
          doctorId: getDocId(4),
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
          doctorId: getDocId(5),
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
          doctorId: getDocId(3),
          status: 'Admitted',
          admissionDate: '2026-03-22',
          avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80',
        },
        {
          name: 'Nusrat Amin',
          age: 19,
          gender: 'Female',
          condition: 'Asthma',
          phone: '+880 1820 111222',
          doctorId: getDocId(6),
          status: 'Admitted',
          admissionDate: '2026-03-24',
          avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
        },
        {
          name: 'Shafiqul Alam',
          age: 67,
          gender: 'Male',
          condition: 'Arthritis',
          phone: '+880 1821 222333',
          doctorId: getDocId(5),
          status: 'Followup',
          admissionDate: '2026-03-25',
          avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
        },
        {
          name: 'Mitu Akter',
          age: 31,
          gender: 'Female',
          condition: 'Chronic Migraine',
          phone: '+880 1822 333444',
          doctorId: getDocId(4),
          status: 'Discharged',
          admissionDate: '2026-03-26',
          avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&auto=format&fit=crop&q=80',
        },
        {
          name: 'Jahangir Kabir',
          age: 54,
          gender: 'Male',
          condition: 'Diabetes Type 2',
          phone: '+880 1823 444555',
          doctorId: getDocId(11),
          status: 'Admitted',
          admissionDate: '2026-03-27',
          avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
        },
        {
          name: 'Ruma Begum',
          age: 48,
          gender: 'Female',
          condition: 'Hypertension',
          phone: '+880 1824 555666',
          doctorId: getDocId(10),
          status: 'Followup',
          admissionDate: '2026-03-28',
          avatarUrl: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=100&auto=format&fit=crop&q=80',
        },
        {
          name: 'Tariqul Hasan',
          age: 11,
          gender: 'Male',
          condition: 'Asthma',
          phone: '+880 1825 666777',
          doctorId: getDocId(6),
          status: 'Discharged',
          admissionDate: '2026-03-29',
          avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
        },
        {
          name: 'Sadia Afrin',
          age: 27,
          gender: 'Female',
          condition: 'General Checkup',
          phone: '+880 1826 777888',
          doctorId: getDocId(7),
          status: 'Followup',
          admissionDate: '2026-04-01',
          avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80',
        },
        {
          name: 'Monirul Haque',
          age: 64,
          gender: 'Male',
          condition: 'Post-Op Recovery',
          phone: '+880 1827 888999',
          doctorId: getDocId(8),
          status: 'Admitted',
          admissionDate: '2026-04-02',
          avatarUrl: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&auto=format&fit=crop&q=80',
        },
        {
          name: 'Laila Parvin',
          age: 52,
          gender: 'Female',
          condition: 'Arthritis',
          phone: '+880 1828 999000',
          doctorId: getDocId(5),
          status: 'Transferred',
          admissionDate: '2026-04-03',
          avatarUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&auto=format&fit=crop&q=80',
        },
        {
          name: 'Mehedi Hasan',
          age: 38,
          gender: 'Male',
          condition: 'Cardiovascular Disease',
          phone: '+880 1829 000111',
          doctorId: getDocId(10),
          status: 'Admitted',
          admissionDate: '2026-04-04',
          avatarUrl: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=100&auto=format&fit=crop&q=80',
        },
        {
          name: 'Tasnim Tabassum',
          age: 22,
          gender: 'Female',
          condition: 'General Checkup',
          phone: '+880 1830 112200',
          doctorId: getDocId(9),
          status: 'Discharged',
          admissionDate: '2026-04-05',
          avatarUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100&auto=format&fit=crop&q=80',
        },
        {
          name: 'Nazmul Karim',
          age: 56,
          gender: 'Male',
          condition: 'Diabetes Type 2',
          phone: '+880 1831 223300',
          doctorId: getDocId(11),
          status: 'Followup',
          admissionDate: '2026-04-06',
          avatarUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=100&auto=format&fit=crop&q=80',
        },
      ];

      let insertedPatients = 0;
      for (const pat of samplePatients) {
        const exists = await Patient.findOne({ phone: pat.phone });
        if (!exists) {
          await Patient.create(pat);
          insertedPatients++;
        }
      }
      const totalPatients = await Patient.countDocuments();
      console.log(`Inserted ${insertedPatients} new patients. Total Patients in DB: ${totalPatients}`);
    }

    console.log('Database seeding process completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during database seed:', error);
    process.exit(1);
  }
}

seed();
