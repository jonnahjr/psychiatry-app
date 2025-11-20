import express from 'express';
import { body } from 'express-validator';
import { AuthController } from '../controllers/auth.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new patient
// @access  Public
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('patientId').matches(/^P\d{6}$/).withMessage('Patient ID must be in format P000000'),
  ],
  AuthController.registerPatient
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').exists().withMessage('Password is required'),
  ],
  AuthController.login
);

// @route   POST /api/auth/refresh
// @desc    Refresh access token
// @access  Public
router.post('/refresh', AuthController.refreshToken);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', authenticate, AuthController.logout);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', authenticate, AuthController.getMe);

// @route   PUT /api/auth/update-password
// @desc    Update password
// @access  Private
router.put(
  '/update-password',
  authenticate,
  [
    body('currentPassword').exists().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  ],
  AuthController.updatePassword
);

// @route   POST /api/auth/forgot-password
// @desc    Forgot password
// @access  Public
router.post(
  '/forgot-password',
  [body('email').isEmail().withMessage('Please provide a valid email')],
  AuthController.forgotPassword
);

// @route   PUT /api/auth/reset-password/:token
// @desc    Reset password
// @access  Public
router.put(
  '/reset-password/:token',
  [
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  AuthController.resetPassword
);

// Admin routes for managing doctors
// @route   POST /api/auth/admin/create-doctor
// @desc    Create doctor account (admin only)
// @access  Private (Admin)
router.post(
  '/admin/create-doctor',
  authenticate,
  requireAdmin,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('licenseNumber').matches(/^LIC\d{6}$/).withMessage('License number must be in format LIC000000'),
    body('specialization').notEmpty().withMessage('Specialization is required'),
  ],
  AuthController.createDoctor
);

// @route   GET /api/auth/admin/doctors
// @desc    Get all doctors
// @access  Private (Admin)
router.get('/admin/doctors', authenticate, requireAdmin, AuthController.getDoctors);

// @route   PUT /api/auth/admin/doctor/:id
// @desc    Update doctor
// @access  Private (Admin)
router.put(
  '/admin/doctor/:id',
  authenticate,
  requireAdmin,
  AuthController.updateDoctor
);

// @route   DELETE /api/auth/admin/doctor/:id
// @desc    Delete doctor
// @access  Private (Admin)
router.delete('/admin/doctor/:id', authenticate, requireAdmin, AuthController.deleteDoctor);

export default router;