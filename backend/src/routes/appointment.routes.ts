import express, { Router } from 'express';

const router: Router = express.Router();

interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  patientName: string;
  date: string;
  time: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  type: 'Video Consultation' | 'In-Person' | 'Follow-up';
  notes?: string;
}

const mockAppointments: Appointment[] = [
  {
    id: 'appointment-1',
    doctorId: 'doctor-1',
    doctorName: 'Dr. Sarah Johnson',
    patientName: 'John Doe',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    time: '10:00 AM',
    status: 'scheduled',
    type: 'Video Consultation',
    notes: 'Initial consultation regarding anxiety management.',
  },
  {
    id: 'appointment-2',
    doctorId: 'doctor-2',
    doctorName: 'Dr. Michael Chen',
    patientName: 'John Doe',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    time: '02:30 PM',
    status: 'completed',
    type: 'Video Consultation',
    notes: 'Follow-up session on CBT exercises.',
  },
  {
    id: 'appointment-3',
    doctorId: 'doctor-3',
    doctorName: 'Dr. Emily Rodriguez',
    patientName: 'John Doe',
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    time: '09:15 AM',
    status: 'confirmed',
    type: 'Follow-up',
    notes: 'Progress review and treatment adjustments.',
  },
];

router.get('/', (_req, res) => {
  res.json({
    success: true,
    count: mockAppointments.length,
    data: mockAppointments,
  });
});

router.get('/:id', (req, res) => {
  const appointment = mockAppointments.find((apt) => apt.id === req.params.id);
  if (!appointment) {
    return res.status(404).json({
      success: false,
      message: 'Appointment not found',
    });
  }

  res.json({
    success: true,
    data: appointment,
  });
});

// Placeholder for creating appointments
router.post('/', (req, res) => {
  const newAppointment = {
    ...req.body,
    id: `appointment-${mockAppointments.length + 1}`,
    status: req.body.status || 'scheduled',
  };

  mockAppointments.push(newAppointment);

  res.status(201).json({
    success: true,
    data: newAppointment,
    message: 'Appointment booked successfully (mock data)',
  });
});

export default router;