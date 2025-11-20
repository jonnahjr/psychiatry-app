// Manual user creation script
const mongoose = require('mongoose');

// User schema (simplified)
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['patient', 'doctor', 'admin'] },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Hash password function (simplified)
const bcrypt = require('bcryptjs');
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', userSchema);

// Patient schema
const patientSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  patientId: String,
  dateOfBirth: Date,
  phone: String,
  address: String,
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  }
});

const Patient = mongoose.model('Patient', patientSchema);

// Doctor schema
const doctorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  licenseNumber: String,
  specialization: String,
  experience: Number,
  education: [String],
  certifications: [String],
  bio: String,
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  availability: [{
    day: String,
    startTime: String,
    endTime: String
  }],
  isVerified: { type: Boolean, default: false }
});

const Doctor = mongoose.model('Doctor', doctorSchema);

async function createUsers() {
  try {
    await mongoose.connect('mongodb://localhost:27017/tele-psychiatry');
    console.log('Connected to database');

    // Clear existing data
    await User.deleteMany({});
    await Patient.deleteMany({});
    await Doctor.deleteMany({});
    console.log('Cleared existing data');

    // Create admin
    const admin = new User({
      name: 'System Administrator',
      email: 'admin@telepsychiatry.com',
      password: 'admin123',
      role: 'admin'
    });
    await admin.save();
    console.log('Created admin user');

    // Create doctors
    const doctor1 = new User({
      name: 'Dr. Sarah Smith',
      email: 'dr.smith@telepsychiatry.com',
      password: 'doctor123',
      role: 'doctor'
    });
    await doctor1.save();

    await Doctor.create({
      user: doctor1._id,
      licenseNumber: 'LIC001234',
      specialization: 'psychiatry',
      experience: 8,
      education: ['MD from Harvard Medical School'],
      certifications: ['Board Certified Psychiatrist'],
      bio: 'Experienced psychiatrist specializing in adult mental health.',
      rating: 4.8,
      reviewCount: 45,
      availability: [
        { day: 'monday', startTime: '09:00', endTime: '17:00' },
        { day: 'wednesday', startTime: '09:00', endTime: '17:00' }
      ],
      isVerified: true
    });

    const doctor2 = new User({
      name: 'Dr. Michael Johnson',
      email: 'dr.johnson@telepsychiatry.com',
      password: 'doctor123',
      role: 'doctor'
    });
    await doctor2.save();

    await Doctor.create({
      user: doctor2._id,
      licenseNumber: 'LIC001235',
      specialization: 'clinical-psychology',
      experience: 12,
      education: ['PhD in Clinical Psychology'],
      certifications: ['Licensed Clinical Psychologist'],
      bio: 'Clinical psychologist specializing in CBT.',
      rating: 4.9,
      reviewCount: 67,
      availability: [
        { day: 'tuesday', startTime: '10:00', endTime: '18:00' },
        { day: 'thursday', startTime: '10:00', endTime: '18:00' }
      ],
      isVerified: true
    });

    // Create patients
    const patient1 = new User({
      name: 'John Doe',
      email: 'john.doe@email.com',
      password: 'patient123',
      role: 'patient'
    });
    await patient1.save();

    await Patient.create({
      user: patient1._id,
      patientId: 'P001234',
      dateOfBirth: new Date('1985-03-15'),
      phone: '+1234567890',
      address: '123 Main St, Anytown, USA',
      emergencyContact: {
        name: 'Jane Doe',
        phone: '+1234567891',
        relationship: 'spouse'
      }
    });

    const patient2 = new User({
      name: 'Jane Smith',
      email: 'jane.smith@email.com',
      password: 'patient123',
      role: 'patient'
    });
    await patient2.save();

    await Patient.create({
      user: patient2._id,
      patientId: 'P001235',
      dateOfBirth: new Date('1990-07-22'),
      phone: '+1234567892',
      address: '456 Oak Ave, Somewhere, USA',
      emergencyContact: {
        name: 'Bob Smith',
        phone: '+1234567893',
        relationship: 'parent'
      }
    });

    console.log('✅ All users created successfully!');
    console.log('\n📋 Default Login Credentials:');
    console.log('Admin: admin@telepsychiatry.com / admin123');
    console.log('Doctor 1: dr.smith@telepsychiatry.com / doctor123');
    console.log('Doctor 2: dr.johnson@telepsychiatry.com / doctor123');
    console.log('Patient 1: john.doe@email.com / patient123');
    console.log('Patient 2: jane.smith@email.com / patient123');

  } catch (error) {
    console.error('❌ Error creating users:', error);
  } finally {
    await mongoose.connection.close();
  }
}

createUsers();