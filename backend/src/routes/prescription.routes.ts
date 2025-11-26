import express, { Router } from 'express';

const router: Router = express.Router();

interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  status: 'active' | 'completed' | 'discontinued';
  prescribedDate: string;
  notes?: string;
}

const mockPrescriptions: Prescription[] = [
  {
    id: 'prescription-1',
    patientId: 'patient-1',
    doctorId: 'doctor-1',
    doctorName: 'Dr. Sarah Johnson',
    medication: 'Sertraline',
    dosage: '50mg',
    frequency: 'Once daily',
    duration: '3 months',
    instructions: 'Take with food in the morning',
    status: 'active',
    prescribedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'For anxiety management. Monitor for side effects.',
  },
  {
    id: 'prescription-2',
    patientId: 'patient-1',
    doctorId: 'doctor-2',
    doctorName: 'Dr. Michael Chen',
    medication: 'Lorazepam',
    dosage: '0.5mg',
    frequency: 'As needed, max 3 times daily',
    duration: '1 month',
    instructions: 'Take only when anxiety symptoms are severe',
    status: 'active',
    prescribedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'PRN medication for breakthrough anxiety.',
  },
  {
    id: 'prescription-3',
    patientId: 'patient-1',
    doctorId: 'doctor-3',
    doctorName: 'Dr. Emily Rodriguez',
    medication: 'Fluoxetine',
    dosage: '20mg',
    frequency: 'Once daily',
    duration: '6 months',
    instructions: 'Take in the morning',
    status: 'completed',
    prescribedDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Completed treatment course.',
  },
];

router.get('/', (_req, res) => {
  res.json({
    success: true,
    count: mockPrescriptions.length,
    data: mockPrescriptions,
  });
});

router.get('/:id', (req, res) => {
  const prescription = mockPrescriptions.find((pres) => pres.id === req.params.id);
  if (!prescription) {
    return res.status(404).json({
      success: false,
      message: 'Prescription not found',
    });
  }

  res.json({
    success: true,
    data: prescription,
  });
});

// Placeholder for creating prescriptions
router.post('/', (req, res) => {
  const newPrescription = {
    ...req.body,
    id: `prescription-${mockPrescriptions.length + 1}`,
    status: req.body.status || 'active',
    prescribedDate: new Date().toISOString(),
  };

  mockPrescriptions.push(newPrescription);

  res.status(201).json({
    success: true,
    data: newPrescription,
    message: 'Prescription created successfully (mock data)',
  });
});

export default router;