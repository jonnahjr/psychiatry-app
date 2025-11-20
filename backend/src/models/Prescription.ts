import mongoose, { Document, Schema } from 'mongoose';

export interface IMedication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface IPrescription extends Document {
  patient: mongoose.Types.ObjectId;
  doctor: mongoose.Types.ObjectId;
  appointment: mongoose.Types.ObjectId;
  medications: IMedication[];
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const medicationSchema = new Schema<IMedication>({
  name: {
    type: String,
    required: [true, 'Medication name is required'],
    maxlength: [100, 'Medication name cannot be more than 100 characters'],
  },
  dosage: {
    type: String,
    required: [true, 'Dosage is required'],
    maxlength: [50, 'Dosage cannot be more than 50 characters'],
  },
  frequency: {
    type: String,
    required: [true, 'Frequency is required'],
    maxlength: [50, 'Frequency cannot be more than 50 characters'],
  },
  duration: {
    type: String,
    required: [true, 'Duration is required'],
    maxlength: [50, 'Duration cannot be more than 50 characters'],
  },
  instructions: {
    type: String,
    required: [true, 'Instructions are required'],
    maxlength: [200, 'Instructions cannot be more than 200 characters'],
  },
});

const prescriptionSchema = new Schema<IPrescription>(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Patient is required'],
    },
    doctor: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor',
      required: [true, 'Doctor is required'],
    },
    appointment: {
      type: Schema.Types.ObjectId,
      ref: 'Appointment',
      required: [true, 'Appointment is required'],
    },
    medications: {
      type: [medicationSchema],
      required: [true, 'At least one medication is required'],
      validate: {
        validator: function (v: IMedication[]) {
          return v.length > 0;
        },
        message: 'At least one medication must be prescribed',
      },
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot be more than 500 characters'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
prescriptionSchema.index({ patient: 1, createdAt: -1 });
prescriptionSchema.index({ doctor: 1, createdAt: -1 });
prescriptionSchema.index({ appointment: 1 });
prescriptionSchema.index({ isActive: 1 });

// Virtual for formatted prescription text
prescriptionSchema.virtual('formattedText').get(function () {
  let text = `Prescription for Patient\n\n`;
  text += `Date: ${this.createdAt.toDateString()}\n\n`;
  text += `Medications:\n`;

  this.medications.forEach((med, index) => {
    text += `${index + 1}. ${med.name}\n`;
    text += `   Dosage: ${med.dosage}\n`;
    text += `   Frequency: ${med.frequency}\n`;
    text += `   Duration: ${med.duration}\n`;
    text += `   Instructions: ${med.instructions}\n\n`;
  });

  if (this.notes) {
    text += `Additional Notes: ${this.notes}\n`;
  }

  return text;
});

// Method to deactivate prescription
prescriptionSchema.methods.deactivate = function () {
  this.isActive = false;
  return this.save();
};

const Prescription = mongoose.model<IPrescription>('Prescription', prescriptionSchema);

export default Prescription;