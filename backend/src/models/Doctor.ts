import mongoose, { Document, Schema } from 'mongoose';

export interface IDoctor extends Document {
  user: mongoose.Types.ObjectId;
  licenseNumber: string;
  specialization: string;
  experience: number;
  education: string[];
  certifications: string[];
  bio: string;
  profilePicture?: string;
  rating: number;
  reviewCount: number;
  availability: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const doctorSchema = new Schema<IDoctor>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    licenseNumber: {
      type: String,
      required: [true, 'License number is required'],
      unique: true,
      uppercase: true,
      validate: {
        validator: function (v: string) {
          return /^LIC\d{6}$/.test(v); // LIC followed by 6 digits
        },
        message: 'License number must be in format LIC000000',
      },
    },
    specialization: {
      type: String,
      required: [true, 'Specialization is required'],
      enum: [
        'psychiatry',
        'psychology',
        'clinical-psychology',
        'counseling-psychology',
        'child-psychiatry',
        'forensic-psychiatry',
        'addiction-psychiatry',
        'geriatric-psychiatry',
        'other'
      ],
    },
    experience: {
      type: Number,
      required: [true, 'Years of experience is required'],
      min: [0, 'Experience cannot be negative'],
      max: [50, 'Experience cannot be more than 50 years'],
    },
    education: [{
      type: String,
      required: [true, 'Education is required'],
      maxlength: [200, 'Education entry cannot be more than 200 characters'],
    }],
    certifications: [{
      type: String,
      maxlength: [200, 'Certification entry cannot be more than 200 characters'],
    }],
    bio: {
      type: String,
      required: [true, 'Bio is required'],
      maxlength: [1000, 'Bio cannot be more than 1000 characters'],
    },
    profilePicture: {
      type: String,
      validate: {
        validator: function (v: string) {
          return /^https?:\/\/.+/.test(v);
        },
        message: 'Profile picture must be a valid URL',
      },
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be more than 5'],
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: [0, 'Review count cannot be negative'],
    },
    availability: [{
      day: {
        type: String,
        required: true,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      },
      startTime: {
        type: String,
        required: true,
        validate: {
          validator: function (v: string) {
            return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
          },
          message: 'Start time must be in HH:MM format',
        },
      },
      endTime: {
        type: String,
        required: true,
        validate: {
          validator: function (v: string) {
            return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
          },
          message: 'End time must be in HH:MM format',
        },
      },
    }],
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
doctorSchema.index({ user: 1 });
doctorSchema.index({ licenseNumber: 1 });
doctorSchema.index({ specialization: 1 });
doctorSchema.index({ rating: -1 });
doctorSchema.index({ isVerified: 1 });

// Virtual for full profile
doctorSchema.virtual('fullProfile').get(function () {
  return {
    ...this.toObject(),
    user: this.user,
  };
});

const Doctor = mongoose.model<IDoctor>('Doctor', doctorSchema);

export default Doctor;