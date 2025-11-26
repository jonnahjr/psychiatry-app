import express, { Router } from 'express';

const router: Router = express.Router();

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  email: string;
  phone?: string;
  experience?: number;
  rating?: number;
  bio?: string;
  availability?: string[];
}

const mockDoctors: Doctor[] = [
  {
    id: 'doctor-1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Psychiatrist',
    email: 'sarah.johnson@telepsychiatry.com',
    phone: '+1 (555) 123-4567',
    experience: 10,
    rating: 4.8,
    bio: 'Specialized in anxiety, depression, and mood disorders with a holistic treatment approach.',
    availability: ['Mon 10:00 AM', 'Wed 2:00 PM', 'Fri 11:00 AM'],
  },
  {
    id: 'doctor-2',
    name: 'Dr. Michael Chen',
    specialty: 'Clinical Psychologist',
    email: 'michael.chen@telepsychiatry.com',
    phone: '+1 (555) 987-6543',
    experience: 8,
    rating: 4.9,
    bio: 'Expert in cognitive behavioral therapy and trauma-informed care.',
    availability: ['Tue 9:00 AM', 'Thu 1:30 PM', 'Sat 10:00 AM'],
  },
  {
    id: 'doctor-3',
    name: 'Dr. Emily Rodriguez',
    specialty: 'Child Psychiatrist',
    email: 'emily.rodriguez@telepsychiatry.com',
    phone: '+1 (555) 246-8102',
    experience: 12,
    rating: 4.7,
    bio: 'Specialized in pediatric mental health and neurodevelopmental disorders.',
    availability: ['Mon 3:00 PM', 'Thu 10:30 AM'],
  },
];

router.get('/', (_req, res) => {
  res.json({
    success: true,
    count: mockDoctors.length,
    data: mockDoctors,
  });
});

router.get('/:id', (req, res) => {
  const doctor = mockDoctors.find((doc) => doc.id === req.params.id);
  if (!doctor) {
    return res.status(404).json({
      success: false,
      message: 'Doctor not found',
    });
  }

  res.json({
    success: true,
    data: doctor,
  });
});

export default router;