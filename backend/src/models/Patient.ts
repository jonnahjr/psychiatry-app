import mongoose, { Document, Schema } from 'mongoose';

export interface IPatient extends Document {
  user: mongoose.Types.ObjectId;
  patientId: string;
  dateOfBirth: Date;
  phone: string;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalHistory: string[];
  allergies: string[];
  currentMedications: string[];
  createdAt: Date;
  updatedAt: Date;
}

const patientSchema = new Schema<IPatient>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    patientId: {
      type: String,
      required: [true, 'Patient ID is required'],
      unique: true,
      uppercase: true,
      validate: {
        validator: function (v: string) {
          return /^P\d{6}$/.test(v); // P followed by 6 digits
        },
        message: 'Patient ID must be in format P000000',
      },
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      validate: {
        validator: function (v: string) {
          return /^\+?[\d\s\-\(\)]+$/.test(v);
        },
        message: 'Please enter a valid phone number',
      },
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      maxlength: [200, 'Address cannot be more than 200 characters'],
    },
    emergencyContact: {
      name: {
        type: String,
        required: [true, 'Emergency contact name is required'],
      },
      phone: {
        type: String,
        required: [true, 'Emergency contact phone is required'],
        validate: {
          validator: function (v: string) {
            return /^\+?[\d\s\-\(\)]+$/.test(v);
          },
          message: 'Please enter a valid emergency contact phone number',
        },
      },
      relationship: {
        type: String,
        required: [true, 'Emergency contact relationship is required'],
        enum: ['parent', 'spouse', 'sibling', 'child', 'friend', 'other'],
      },
    },
    medicalHistory: [{
      type: String,
      maxlength: [500, 'Medical history entry cannot be more than 500 characters'],
    }],
    allergies: [{
      type: String,
      maxlength: [100, 'Allergy entry cannot be more than 100 characters'],
    }],
    currentMedications: [{
      type: String,
      maxlength: [200, 'Medication entry cannot be more than 200 characters'],
    }],
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
patientSchema.index({ user: 1 });
patientSchema.index({ patientId: 1 });
patientSchema.index({ 'emergencyContact.phone': 1 });

const Patient = mongoose.model<IPatient>('Patient', patientSchema);

export default Patient;