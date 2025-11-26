-- Add gender and insurance_id columns to patients table
ALTER TABLE patients ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS insurance_id TEXT;