# Supabase Setup Guide for Tele-Psychiatry System

## 🚀 Quick Setup (3 Steps)

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in project details:
   - Name: `tele-psychiatry`
   - Database Password: Choose a strong password
   - Region: Select closest to your location
4. Click "Create new project"
5. Wait for project creation (2-3 minutes)

### Step 2: Get API Keys
1. In your project dashboard, go to **Settings → API**
2. Copy these values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Step 3: Configure Environment
Update `backend/.env`:
```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## 🗄️ Database Setup

### Option A: Run Complete Schema (Recommended)
1. In Supabase dashboard, go to **SQL Editor**
2. Copy the entire content from `backend/supabase-schema.sql`
3. Click **Run** to create all tables and policies

### Option B: Manual Table Creation
If you prefer step-by-step:

1. **Create Tables** (SQL Editor):
```sql
-- Run these one by one in SQL Editor

-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'patient' CHECK (role IN ('patient', 'doctor', 'admin')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Patients table
CREATE TABLE patients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  patient_id TEXT UNIQUE NOT NULL,
  date_of_birth DATE NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  emergency_contact JSONB NOT NULL,
  medical_history TEXT[] DEFAULT '{}',
  allergies TEXT[] DEFAULT '{}',
  current_medications TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Doctors table
CREATE TABLE doctors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  license_number TEXT UNIQUE NOT NULL,
  specialization TEXT NOT NULL,
  experience INTEGER NOT NULL DEFAULT 0,
  education TEXT[] NOT NULL DEFAULT '{}',
  certifications TEXT[] DEFAULT '{}',
  bio TEXT NOT NULL,
  profile_picture TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  availability JSONB DEFAULT '[]',
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments table
CREATE TABLE appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled')),
  type TEXT DEFAULT 'consultation' CHECK (type IN ('consultation', 'follow-up', 'emergency')),
  notes TEXT,
  prescription TEXT,
  video_room_id TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file')),
  file_url TEXT,
  file_name TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prescriptions table
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
CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'refunded')),
  payment_method TEXT NOT NULL,
  stripe_payment_intent_id TEXT,
  transaction_id TEXT,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

2. **Create Indexes**:
```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_patients_user_id ON patients(user_id);
CREATE INDEX idx_doctors_user_id ON doctors(user_id);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
```

## 👥 Create Test Users

Run this in SQL Editor to create default test accounts:

```sql
-- Create test users with bcrypt hashed passwords
-- Passwords: admin123, doctor123, patient123

INSERT INTO users (name, email, password_hash, role) VALUES
('System Administrator', 'admin@telepsychiatry.com', '$2a$08$example.hash.for.admin123', 'admin'),
('Dr. Sarah Smith', 'dr.smith@telepsychiatry.com', '$2a$08$example.hash.for.doctor123', 'doctor'),
('Dr. Michael Johnson', 'dr.johnson@telepsychiatry.com', '$2a$08$example.hash.for.doctor123', 'doctor'),
('John Doe', 'john.doe@email.com', '$2a$08$example.hash.for.patient123', 'patient'),
('Jane Smith', 'jane.smith@email.com', '$2a$08$example.hash.for.patient123', 'patient');
```

## 🔐 Enable Row Level Security (Optional)

For production security, enable RLS and create policies:

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Basic policy example (users can read their own data)
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);
```

## ✅ Test Connection

1. **Start Backend**:
```bash
cd backend
npm run dev
```

2. **Test Health Check**:
```bash
curl http://localhost:5000/api/health
```

3. **Test Login** (after implementing auth routes):
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@telepsychiatry.com","password":"admin123"}'
```

## 🔑 Default Login Credentials

After setup, use these credentials:

- **Admin**: `admin@telepsychiatry.com` / `admin123`
- **Doctor 1**: `dr.smith@telepsychiatry.com` / `doctor123`
- **Doctor 2**: `dr.johnson@telepsychiatry.com` / `doctor123`
- **Patient 1**: `john.doe@email.com` / `patient123`
- **Patient 2**: `jane.smith@email.com` / `patient123`

## 🚀 Next Steps

1. ✅ Supabase project created
2. ✅ Database schema deployed
3. ✅ Test users created
4. 🔄 Convert API routes to use Supabase queries
5. 🔄 Test complete authentication flow
6. 🔄 Start mobile app development

The Supabase backend is now ready! 🎉