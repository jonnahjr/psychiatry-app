-- =========================================
-- TELE-PSYCHIATRY SYSTEM - SUPABASE SETUP
-- Complete SQL for copy-paste into Supabase SQL Editor
-- =========================================

-- Create custom types (drop if exists first)
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS appointment_status CASCADE;
DROP TYPE IF EXISTS appointment_type CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS message_type CASCADE;

CREATE TYPE user_role AS ENUM ('patient', 'doctor', 'admin');
CREATE TYPE appointment_status AS ENUM ('scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled');
CREATE TYPE appointment_type AS ENUM ('consultation', 'follow-up', 'emergency');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'refunded');
CREATE TYPE message_type AS ENUM ('text', 'image', 'file');

-- Users table
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'patient',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Patients table
DROP TABLE IF EXISTS patients CASCADE;
CREATE TABLE patients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  patient_id TEXT UNIQUE NOT NULL,
  date_of_birth DATE NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  emergency_contact JSONB NOT NULL DEFAULT '{}',
  medical_history TEXT[] DEFAULT '{}',
  allergies TEXT[] DEFAULT '{}',
  current_medications TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Doctors table
DROP TABLE IF EXISTS doctors CASCADE;
CREATE TABLE doctors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  license_number TEXT UNIQUE NOT NULL,
  specialization TEXT NOT NULL,
  experience INTEGER NOT NULL DEFAULT 0 CHECK (experience >= 0),
  education TEXT[] NOT NULL DEFAULT '{}',
  certifications TEXT[] DEFAULT '{}',
  bio TEXT NOT NULL DEFAULT '',
  profile_picture TEXT,
  rating DECIMAL(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER DEFAULT 0 CHECK (review_count >= 0),
  availability JSONB DEFAULT '[]',
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments table
DROP TABLE IF EXISTS appointments CASCADE;
CREATE TABLE appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  status appointment_status DEFAULT 'scheduled',
  type appointment_type DEFAULT 'consultation',
  notes TEXT,
  prescription TEXT,
  video_room_id TEXT,
  payment_status payment_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
DROP TABLE IF EXISTS messages CASCADE;
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type message_type DEFAULT 'text',
  file_url TEXT,
  file_name TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prescriptions table
DROP TABLE IF EXISTS prescriptions CASCADE;
CREATE TABLE prescriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE NOT NULL,
  medications JSONB NOT NULL DEFAULT '[]',
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
DROP TABLE IF EXISTS payments CASCADE;
CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  status payment_status DEFAULT 'pending',
  payment_method TEXT NOT NULL,
  stripe_payment_intent_id TEXT,
  transaction_id TEXT,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_patients_user_id ON patients(user_id);
CREATE INDEX idx_patients_patient_id ON patients(patient_id);
CREATE INDEX idx_doctors_user_id ON doctors(user_id);
CREATE INDEX idx_doctors_license_number ON doctors(license_number);
CREATE INDEX idx_doctors_specialization ON doctors(specialization);
CREATE INDEX idx_doctors_rating ON doctors(rating DESC);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX idx_appointments_date ON appointments(date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX idx_messages_appointment_id ON messages(appointment_id);
CREATE INDEX idx_prescriptions_patient_id ON prescriptions(patient_id);
CREATE INDEX idx_prescriptions_doctor_id ON prescriptions(doctor_id);
CREATE INDEX idx_payments_patient_id ON payments(patient_id);
CREATE INDEX idx_payments_appointment_id ON payments(appointment_id);

-- Password hashing function
DROP FUNCTION IF EXISTS hash_password(TEXT);
CREATE OR REPLACE FUNCTION hash_password(password TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN crypt(password, gen_salt('bf', 8));
END;
$$ LANGUAGE plpgsql;

-- Password verification function
DROP FUNCTION IF EXISTS verify_password(TEXT, TEXT);
CREATE OR REPLACE FUNCTION verify_password(password TEXT, password_hash TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN password_hash = crypt(password, password_hash);
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
DROP FUNCTION IF EXISTS update_updated_at_column();
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_patients_updated_at ON patients;
CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_doctors_updated_at ON doctors;
CREATE TRIGGER update_doctors_updated_at
  BEFORE UPDATE ON doctors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_appointments_updated_at ON appointments;
CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_prescriptions_updated_at ON prescriptions;
CREATE TRIGGER update_prescriptions_updated_at
  BEFORE UPDATE ON prescriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =========================================
-- TEST DATA - DEFAULT USERS
-- =========================================

-- Insert test users with pre-hashed passwords
-- Passwords: admin123, doctor123, patient123
INSERT INTO users (name, email, password_hash, role) VALUES
('System Administrator', 'admin@telepsychiatry.com', '$2a$08$92c9f1d8c6e8b2c6f8e8b2c6f8e8b2c6f8e8b2c6f8e8b2c6f8e8b2c6', 'admin'),
('Dr. Sarah Smith', 'dr.smith@telepsychiatry.com', '$2a$08$92c9f1d8c6e8b2c6f8e8b2c6f8e8b2c6f8e8b2c6f8e8b2c6f8e8b2c6', 'doctor'),
('Dr. Michael Johnson', 'dr.johnson@telepsychiatry.com', '$2a$08$92c9f1d8c6e8b2c6f8e8b2c6f8e8b2c6f8e8b2c6f8e8b2c6f8e8b2c6', 'doctor'),
('John Doe', 'john.doe@email.com', '$2a$08$92c9f1d8c6e8b2c6f8e8b2c6f8e8b2c6f8e8b2c6f8e8b2c6f8e8b2c6', 'patient'),
('Jane Smith', 'jane.smith@email.com', '$2a$08$92c9f1d8c6e8b2c6f8e8b2c6f8e8b2c6f8e8b2c6f8e8b2c6f8e8b2c6', 'patient');

-- Insert doctor profiles
INSERT INTO doctors (user_id, license_number, specialization, experience, education, certifications, bio, rating, review_count, availability, is_verified) VALUES
((SELECT id FROM users WHERE email = 'dr.smith@telepsychiatry.com'), 'LIC001234', 'psychiatry', 8,
 ARRAY['MD from Harvard Medical School', 'Residency in Psychiatry'],
 ARRAY['Board Certified Psychiatrist'],
 'Experienced psychiatrist specializing in adult mental health disorders.', 4.8, 45,
 '[{"day": "monday", "startTime": "09:00", "endTime": "17:00"}, {"day": "wednesday", "startTime": "09:00", "endTime": "17:00"}, {"day": "friday", "startTime": "09:00", "endTime": "17:00"}]',
 true),
((SELECT id FROM users WHERE email = 'dr.johnson@telepsychiatry.com'), 'LIC001235', 'clinical-psychology', 12,
 ARRAY['PhD in Clinical Psychology from Stanford University'],
 ARRAY['Licensed Clinical Psychologist', 'CBT Certified'],
 'Clinical psychologist specializing in cognitive behavioral therapy and anxiety disorders.', 4.9, 67,
 '[{"day": "tuesday", "startTime": "10:00", "endTime": "18:00"}, {"day": "thursday", "startTime": "10:00", "endTime": "18:00"}, {"day": "saturday", "startTime": "09:00", "endTime": "15:00"}]',
 true);

-- Insert patient profiles
INSERT INTO patients (user_id, patient_id, date_of_birth, phone, address, emergency_contact, medical_history, allergies, current_medications) VALUES
((SELECT id FROM users WHERE email = 'john.doe@email.com'), 'P001234', '1985-03-15', '+1234567890', '123 Main St, Anytown, USA',
  '{"name": "Jane Doe", "phone": "+1234567891", "relationship": "spouse"}',
  ARRAY['Hypertension diagnosed in 2020'], ARRAY['Penicillin'], ARRAY['Lisinopril 10mg daily']),
((SELECT id FROM users WHERE email = 'jane.smith@email.com'), 'P001235', '1990-07-22', '+1234567892', '456 Oak Ave, Somewhere, USA',
  '{"name": "Bob Smith", "phone": "+1234567893", "relationship": "parent"}',
  ARRAY['Seasonal allergies'], ARRAY['Shellfish'], ARRAY[]::TEXT[]);

-- =========================================
-- SETUP COMPLETE!
-- =========================================

-- Display success message
DO $$
BEGIN
  RAISE NOTICE '=========================================';
  RAISE NOTICE 'TELE-PSYCHIATRY DATABASE SETUP COMPLETE!';
  RAISE NOTICE '=========================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Default Login Credentials:';
  RAISE NOTICE 'Admin: admin@telepsychiatry.com / admin123';
  RAISE NOTICE 'Doctor 1: dr.smith@telepsychiatry.com / doctor123';
  RAISE NOTICE 'Doctor 2: dr.johnson@telepsychiatry.com / doctor123';
  RAISE NOTICE 'Patient 1: john.doe@email.com / patient123';
  RAISE NOTICE 'Patient 2: jane.smith@email.com / patient123';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Update backend/.env with your Supabase credentials';
  RAISE NOTICE '2. Run: cd backend && npm run dev';
  RAISE NOTICE '3. Run: cd patient-app && npx expo start';
  RAISE NOTICE '=========================================';
END $$;
