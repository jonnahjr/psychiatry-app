import mongoose from 'mongoose';
import User from '../models/User';
import Patient from '../models/Patient';
import Doctor from '../models/Doctor';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tele-psychiatry');
    console.log('Connected to database');

    // Clear existing data
    await User.deleteMany({});
    await Patient.deleteMany({});
    await Doctor.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@telepsychiatry.com',
      password: 'admin123',
      role: 'admin' as const,
    });
    console.log('Created admin user');

    // Create doctor users and profiles
    const doctor1User = await User.create({
      name: 'Dr. Sarah Smith',
      email: 'dr.smith@telepsychiatry.com',
      password: 'doctor123',
      role: 'doctor' as const,
    });

    await Doctor.create({
      user: doctor1User._id,
      licenseNumber: 'LIC001234',
      specialization: 'psychiatry',
      experience: 8,
      education: ['MD from Harvard Medical School', 'Residency in Psychiatry'],
      certifications: ['Board Certified Psychiatrist'],
      bio: 'Experienced psychiatrist specializing in adult mental health disorders.',
      rating: 4.8,
      reviewCount: 45,
      availability: [
        { day: 'monday', startTime: '09:00', endTime: '17:00' },
        { day: 'wednesday', startTime: '09:00', endTime: '17:00' },
        { day: 'friday', startTime: '09:00', endTime: '17:00' },
      ],
      isVerified: true,
    });

    const doctor2User = await User.create({
      name: 'Dr. Michael Johnson',
      email: 'dr.johnson@telepsychiatry.com',
      password: 'doctor123',
      role: 'doctor' as const,
    });

    await Doctor.create({
      user: doctor2User._id,
      licenseNumber: 'LIC001235',
      specialization: 'clinical-psychology',
      experience: 12,
      education: ['PhD in Clinical Psychology from Stanford University'],
      certifications: ['Licensed Clinical Psychologist', 'CBT Certified'],
      bio: 'Clinical psychologist specializing in cognitive behavioral therapy and anxiety disorders.',
      rating: 4.9,
      reviewCount: 67,
      availability: [
        { day: 'tuesday', startTime: '10:00', endTime: '18:00' },
        { day: 'thursday', startTime: '10:00', endTime: '18:00' },
        { day: 'saturday', startTime: '09:00', endTime: '15:00' },
      ],
      isVerified: true,
    });
    console.log('Created doctor users');

    // Create patient users and profiles
    const patient1User = await User.create({
      name: 'John Doe',
      email: 'john.doe@email.com',
      password: 'patient123',
      role: 'patient' as const,
    });

    await Patient.create({
      user: patient1User._id,
      patientId: 'P001234',
      dateOfBirth: new Date('1985-03-15'),
      phone: '+1234567890',
      address: '123 Main St, Anytown, USA',
      emergencyContact: {
        name: 'Jane Doe',
        phone: '+1234567891',
        relationship: 'spouse',
      },
      medicalHistory: ['Hypertension diagnosed in 2020'],
      allergies: ['Penicillin'],
      currentMedications: ['Lisinopril 10mg daily'],
    });

    const patient2User = await User.create({
      name: 'Jane Smith',
      email: 'jane.smith@email.com',
      password: 'patient123',
      role: 'patient' as const,
    });

    await Patient.create({
      user: patient2User._id,
      patientId: 'P001235',
      dateOfBirth: new Date('1990-07-22'),
      phone: '+1234567892',
      address: '456 Oak Ave, Somewhere, USA',
      emergencyContact: {
        name: 'Bob Smith',
        phone: '+1234567893',
        relationship: 'parent',
      },
      medicalHistory: ['Seasonal allergies'],
      allergies: ['Shellfish'],
      currentMedications: [],
    });
    console.log('Created patient users');

    console.log('Database seeded successfully!');
    console.log('\nDefault login credentials:');
    console.log('Admin: admin@telepsychiatry.com / admin123');
    console.log('Doctor 1: dr.smith@telepsychiatry.com / doctor123');
    console.log('Doctor 2: dr.johnson@telepsychiatry.com / doctor123');
    console.log('Patient 1: john.doe@email.com / patient123');
    console.log('Patient 2: jane.smith@email.com / patient123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the seed function
seedDatabase();