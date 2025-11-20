// Temporarily simplified - using mock database instead
export interface IAppointment {
  patient: string;
  doctor: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  type: 'consultation' | 'follow-up' | 'emergency';
  notes?: string;
  prescription?: string;
  videoRoomId?: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: Date;
  updatedAt: Date;
}

const Appointment = null;
export default Appointment;