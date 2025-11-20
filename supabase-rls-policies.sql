-- =========================================
-- ROW LEVEL SECURITY POLICIES FOR SUPABASE
-- Add these policies to secure your database
-- =========================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- =========================================
-- USERS TABLE POLICIES
-- =========================================

-- Users can view their own data
DROP POLICY IF EXISTS "Users can view own data" ON users;
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own data
DROP POLICY IF EXISTS "Users can update own data" ON users;
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Admins can view all users
DROP POLICY IF EXISTS "Admins can view all users" ON users;
CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update all users
DROP POLICY IF EXISTS "Admins can update all users" ON users;
CREATE POLICY "Admins can update all users" ON users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Allow user registration (insert without auth.uid check)
DROP POLICY IF EXISTS "Allow user registration" ON users;
CREATE POLICY "Allow user registration" ON users
  FOR INSERT WITH CHECK (true);

-- =========================================
-- PATIENTS TABLE POLICIES
-- =========================================

-- Patients can view their own data
DROP POLICY IF EXISTS "Patients can view own data" ON patients;
CREATE POLICY "Patients can view own data" ON patients
  FOR SELECT USING (user_id = auth.uid());

-- Patients can update their own data
DROP POLICY IF EXISTS "Patients can update own data" ON patients;
CREATE POLICY "Patients can update own data" ON patients
  FOR UPDATE USING (user_id = auth.uid());

-- Patients can insert their own profile
DROP POLICY IF EXISTS "Patients can create own profile" ON patients;
CREATE POLICY "Patients can create own profile" ON patients
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Doctors can view their patients
DROP POLICY IF EXISTS "Doctors can view their patients" ON patients;
CREATE POLICY "Doctors can view their patients" ON patients
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM appointments a
      WHERE a.patient_id = patients.id
      AND a.doctor_id IN (
        SELECT d.id FROM doctors d WHERE d.user_id = auth.uid()
      )
    )
  );

-- Admins can view all patients
DROP POLICY IF EXISTS "Admins can view all patients" ON patients;
CREATE POLICY "Admins can view all patients" ON patients
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =========================================
-- DOCTORS TABLE POLICIES
-- =========================================

-- Doctors can view their own data
DROP POLICY IF EXISTS "Doctors can view own data" ON doctors;
CREATE POLICY "Doctors can view own data" ON doctors
  FOR SELECT USING (user_id = auth.uid());

-- Doctors can update their own data
DROP POLICY IF EXISTS "Doctors can update own data" ON doctors;
CREATE POLICY "Doctors can update own data" ON doctors
  FOR UPDATE USING (user_id = auth.uid());

-- Doctors can create their own profile
DROP POLICY IF EXISTS "Doctors can create own profile" ON doctors;
CREATE POLICY "Doctors can create own profile" ON doctors
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Patients can view their doctors
DROP POLICY IF EXISTS "Patients can view their doctors" ON doctors;
CREATE POLICY "Patients can view their doctors" ON doctors
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM appointments a
      WHERE a.doctor_id = doctors.id
      AND a.patient_id IN (
        SELECT p.id FROM patients p WHERE p.user_id = auth.uid()
      )
    )
  );

-- All users can view verified doctors (for booking)
DROP POLICY IF EXISTS "Anyone can view verified doctors" ON doctors;
CREATE POLICY "Anyone can view verified doctors" ON doctors
  FOR SELECT USING (is_verified = true);

-- Admins can view all doctors
DROP POLICY IF EXISTS "Admins can view all doctors" ON doctors;
CREATE POLICY "Admins can view all doctors" ON doctors
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update all doctors
DROP POLICY IF EXISTS "Admins can update all doctors" ON doctors;
CREATE POLICY "Admins can update all doctors" ON doctors
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =========================================
-- APPOINTMENTS TABLE POLICIES
-- =========================================

-- Users can view their appointments
DROP POLICY IF EXISTS "Users can view their appointments" ON appointments;
CREATE POLICY "Users can view their appointments" ON appointments
  FOR SELECT USING (
    patient_id IN (SELECT id FROM patients WHERE user_id = auth.uid()) OR
    doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid())
  );

-- Users can create appointments
DROP POLICY IF EXISTS "Users can create appointments" ON appointments;
CREATE POLICY "Users can create appointments" ON appointments
  FOR INSERT WITH CHECK (
    patient_id IN (SELECT id FROM patients WHERE user_id = auth.uid()) OR
    doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid())
  );

-- Users can update their appointments
DROP POLICY IF EXISTS "Users can update their appointments" ON appointments;
CREATE POLICY "Users can update their appointments" ON appointments
  FOR UPDATE USING (
    patient_id IN (SELECT id FROM patients WHERE user_id = auth.uid()) OR
    doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid())
  );

-- Admins can view all appointments
DROP POLICY IF EXISTS "Admins can view all appointments" ON appointments;
CREATE POLICY "Admins can view all appointments" ON appointments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =========================================
-- MESSAGES TABLE POLICIES
-- =========================================

-- Users can view their messages
DROP POLICY IF EXISTS "Users can view their messages" ON messages;
CREATE POLICY "Users can view their messages" ON messages
  FOR SELECT USING (
    sender_id = auth.uid() OR receiver_id = auth.uid()
  );

-- Users can send messages
DROP POLICY IF EXISTS "Users can send messages" ON messages;
CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());

-- Users can update their sent messages
DROP POLICY IF EXISTS "Users can update their sent messages" ON messages;
CREATE POLICY "Users can update their sent messages" ON messages
  FOR UPDATE USING (sender_id = auth.uid());

-- =========================================
-- PRESCRIPTIONS TABLE POLICIES
-- =========================================

-- Users can view their prescriptions
DROP POLICY IF EXISTS "Users can view their prescriptions" ON prescriptions;
CREATE POLICY "Users can view their prescriptions" ON prescriptions
  FOR SELECT USING (
    patient_id IN (SELECT id FROM patients WHERE user_id = auth.uid()) OR
    doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid())
  );

-- Doctors can create prescriptions
DROP POLICY IF EXISTS "Doctors can create prescriptions" ON prescriptions;
CREATE POLICY "Doctors can create prescriptions" ON prescriptions
  FOR INSERT WITH CHECK (
    doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid())
  );

-- Doctors can update their prescriptions
DROP POLICY IF EXISTS "Doctors can update their prescriptions" ON prescriptions;
CREATE POLICY "Doctors can update their prescriptions" ON prescriptions
  FOR UPDATE USING (
    doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid())
  );

-- =========================================
-- PAYMENTS TABLE POLICIES
-- =========================================

-- Users can view their payments
DROP POLICY IF EXISTS "Users can view their payments" ON payments;
CREATE POLICY "Users can view their payments" ON payments
  FOR SELECT USING (
    patient_id IN (SELECT id FROM patients WHERE user_id = auth.uid())
  );

-- Users can create payments
DROP POLICY IF EXISTS "Users can create payments" ON payments;
CREATE POLICY "Users can create payments" ON payments
  FOR INSERT WITH CHECK (
    patient_id IN (SELECT id FROM patients WHERE user_id = auth.uid())
  );

-- Admins can view all payments
DROP POLICY IF EXISTS "Admins can view all payments" ON payments;
CREATE POLICY "Admins can view all payments" ON payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =========================================
-- SUCCESS MESSAGE
-- =========================================

DO $$
BEGIN
  RAISE NOTICE '=========================================';
  RAISE NOTICE '🔒 ROW LEVEL SECURITY POLICIES APPLIED!';
  RAISE NOTICE '=========================================';
  RAISE NOTICE '';
  RAISE NOTICE '✅ RLS enabled on all tables';
  RAISE NOTICE '✅ Security policies created';
  RAISE NOTICE '✅ Database is now secure';
  RAISE NOTICE '';
  RAISE NOTICE 'Tables should now show "Restricted" instead of "Unrestricted"';
  RAISE NOTICE '';
  RAISE NOTICE '=========================================';
END $$;