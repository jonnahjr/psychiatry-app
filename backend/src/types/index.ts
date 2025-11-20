import { Request } from 'express';

export interface IAuthRequest extends Request {
  user?: IUser;
}

export interface IUser {
  id?: string;
  _id?: string; // Keep for backward compatibility
  name: string;
  email: string;
  password?: string;
  role: 'patient' | 'doctor' | 'admin';
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPatient extends IUser {
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
}

export interface IDoctor extends IUser {
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
}

export interface IAppointment {
  _id?: string;
  patientId: string;
  doctorId: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  type: 'consultation' | 'follow-up' | 'emergency';
  notes?: string;
  prescription?: string;
  videoRoomId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IMessage {
  _id?: string;
  senderId: string;
  receiverId: string;
  appointmentId?: string;
  content: string;
  messageType: 'text' | 'image' | 'file';
  isRead: boolean;
  createdAt?: Date;
}

export interface IPrescription {
  _id?: string;
  patientId: string;
  doctorId: string;
  appointmentId: string;
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }[];
  notes?: string;
  createdAt?: Date;
}

export interface IPayment {
  _id?: string;
  patientId: string;
  appointmentId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionId?: string;
  createdAt?: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}