// Mock database service for demo purposes
// This allows testing without external database setup

interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: 'patient' | 'doctor' | 'admin';
  created_at: string;
}

interface Patient {
  id: string;
  user_id: string;
  patient_id: string;
  date_of_birth: string;
  phone: string;
  address: string;
  emergency_contact: any;
  created_at: string;
}

class MockDatabase {
  private users: User[] = [];
  private patients: Patient[] = [];
  private doctors: any[] = [];
  private appointments: any[] = [];
  private messages: any[] = [];
  private prescriptions: any[] = [];
  private payments: any[] = [];

  constructor() {
    this.initializeDemoData();
  }

  private initializeDemoData() {
    // Create demo admin user
    const adminUser: User = {
      id: 'admin-1',
      name: 'Admin User',
      email: 'admin@telepsychiatry.com',
      password_hash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj8JZwHdQcK', // password: admin123
      role: 'admin',
      created_at: new Date().toISOString(),
    };

    // Create demo doctor
    const doctorUser: User = {
      id: 'doctor-1',
      name: 'Dr. Sarah Smith',
      email: 'dr.smith@telepsychiatry.com',
      password_hash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj8JZwHdQcK', // password: doctor123
      role: 'doctor',
      created_at: new Date().toISOString(),
    };

    // Create demo patient
    const patientUser: User = {
      id: 'patient-1',
      name: 'John Doe',
      email: 'john.doe@email.com',
      password_hash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj8JZwHdQcK', // password: patient123
      role: 'patient',
      created_at: new Date().toISOString(),
    };

    this.users.push(adminUser, doctorUser, patientUser);

    // Create patient profile
    const patientProfile: Patient = {
      id: 'patient-profile-1',
      user_id: 'patient-1',
      patient_id: 'P000001',
      date_of_birth: '1990-01-01',
      phone: '+1234567890',
      address: '123 Main St, City, State',
      emergency_contact: {
        name: 'Jane Doe',
        phone: '+1234567891',
        relationship: 'spouse',
      },
      created_at: new Date().toISOString(),
    };

    this.patients.push(patientProfile);

    // Create doctor profile
    const doctorProfile = {
      id: 'doctor-profile-1',
      user_id: 'doctor-1',
      license_number: 'LIC000001',
      specialization: 'psychiatry',
      experience: 10,
      education: ['MD from Harvard Medical School'],
      certifications: ['Board Certified Psychiatrist'],
      bio: 'Experienced psychiatrist specializing in mental health treatment.',
      rating: 4.8,
      review_count: 25,
      availability: [
        { day: 'monday', start_time: '09:00', end_time: '17:00' },
        { day: 'wednesday', start_time: '09:00', end_time: '17:00' },
        { day: 'friday', start_time: '09:00', end_time: '17:00' },
      ],
      is_verified: true,
      created_at: new Date().toISOString(),
    };

    this.doctors.push(doctorProfile);
  }

  // User operations
  async getUserByEmail(email: string) {
    const user = this.users.find(u => u.email === email);
    return user ? { data: user, error: null } : { data: null, error: 'User not found' };
  }

  async getUserById(id: string) {
    const user = this.users.find(u => u.id === id);
    return user ? { data: user, error: null } : { data: null, error: 'User not found' };
  }

  async createUser(userData: Omit<User, 'id' | 'created_at'>) {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    this.users.push(newUser);
    return { data: newUser, error: null };
  }

  async updateUser(id: string, updateData: Partial<User>) {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return { data: null, error: 'User not found' };

    this.users[index] = { ...this.users[index], ...updateData };
    return { data: this.users[index], error: null };
  }

  // Patient operations
  async getPatientByUserId(userId: string) {
    const patient = this.patients.find(p => p.user_id === userId);
    return patient ? { data: patient, error: null } : { data: null, error: 'Patient not found' };
  }

  async getPatientByPatientId(patientId: string) {
    const patient = this.patients.find(p => p.patient_id === patientId);
    return patient ? { data: patient, error: null } : { data: null, error: 'Patient not found' };
  }

  async createPatient(patientData: Omit<Patient, 'id' | 'created_at'>) {
    const newPatient: Patient = {
      ...patientData,
      id: `patient-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    this.patients.push(newPatient);
    return { data: newPatient, error: null };
  }

  // Doctor operations
  async getDoctorByUserId(userId: string) {
    const doctor = this.doctors.find(d => d.user_id === userId);
    return doctor ? { data: doctor, error: null } : { data: null, error: 'Doctor not found' };
  }

  async getDoctorByLicenseNumber(licenseNumber: string) {
    const doctor = this.doctors.find(d => d.license_number === licenseNumber);
    return doctor ? { data: doctor, error: null } : { data: null, error: 'Doctor not found' };
  }

  async getVerifiedDoctors() {
    const verifiedDoctors = this.doctors.filter(d => d.is_verified);
    return { data: verifiedDoctors, error: null };
  }

  async createDoctor(doctorData: any) {
    const newDoctor = {
      ...doctorData,
      id: `doctor-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    this.doctors.push(newDoctor);
    return { data: newDoctor, error: null };
  }

  // Generic query methods to mimic Supabase
  from(table: string) {
    return {
      select: (columns: string = '*') => ({
        eq: (column: string, value: any) => ({
          single: () => {
            let data = null;
            let error = null;
            try {
              switch (table) {
                case 'users':
                  data = this.users.find(item => (item as any)[column.replace('_', '')] === value);
                  if (!data) error = 'User not found';
                  break;
                case 'patients':
                  data = this.patients.find(item => (item as any)[column] === value);
                  if (!data) error = 'Patient not found';
                  break;
                case 'doctors':
                  data = this.doctors.find(item => (item as any)[column] === value);
                  if (!data) error = 'Doctor not found';
                  break;
                default:
                  error = 'Table not found';
              }
            } catch (e) {
              error = 'Query failed';
            }
            return Promise.resolve({ data, error });
          }
        }),
        single: () => {
          let data = null;
          let error = null;
          try {
            switch (table) {
              case 'users':
                data = this.users[0]; // Return first user for demo
                break;
              case 'patients':
                data = this.patients[0];
                break;
              case 'doctors':
                data = this.doctors.filter(d => d.is_verified);
                break;
              default:
                error = 'Table not found';
            }
          } catch (e) {
            error = 'Query failed';
          }
          return Promise.resolve({ data, error });
        }
      }),
      insert: (data: any) => ({
        select: () => ({
          single: () => {
            let result = null;
            let error = null;
            try {
              switch (table) {
                case 'users':
                  result = this.createUser(data[0] || data);
                  break;
                case 'patients':
                  result = this.createPatient(data[0] || data);
                  break;
                case 'doctors':
                  result = this.createDoctor(data[0] || data);
                  break;
                default:
                  error = 'Table not found';
              }
            } catch (e) {
              error = 'Insert failed';
            }
            return result;
          }
        })
      }),
      update: (updateData: any) => ({
        eq: (column: string, value: any) => ({
          select: () => ({
            single: () => {
              let result = null;
              let error = null;
              try {
                switch (table) {
                  case 'users':
                    const userIndex = this.users.findIndex(u => (u as any)[column.replace('_', '')] === value);
                    if (userIndex !== -1) {
                      this.users[userIndex] = { ...this.users[userIndex], ...updateData };
                      result = { data: this.users[userIndex], error: null };
                    } else {
                      error = 'User not found';
                    }
                    break;
                  default:
                    error = 'Update not implemented for this table';
                }
              } catch (e) {
                error = 'Update failed';
              }
              return Promise.resolve(result || { data: null, error });
            }
          })
        })
      })
    };
  }
}

export const mockDb = new MockDatabase();