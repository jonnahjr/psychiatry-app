import express from 'express';
import { body, param } from 'express-validator';
import { PaymentController } from '../controllers/payment.controller';
import { authenticate, requirePatient, requireDoctorOrAdmin } from '../middleware/auth.middleware';

const router = express.Router();

// @route   POST /api/payments/create-intent
// @desc    Create payment intent
// @access  Private (Patient)
router.post(
  '/create-intent',
  authenticate,
  requirePatient,
  [
    body('appointmentId').notEmpty().withMessage('Appointment ID is required'),
    body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
    body('currency').optional().isIn(['usd', 'eur', 'etb']).withMessage('Invalid currency'),
  ],
  PaymentController.createPaymentIntent
);

// @route   POST /api/payments/confirm
// @desc    Confirm payment
// @access  Private (Patient)
router.post(
  '/confirm',
  authenticate,
  requirePatient,
  [
    body('paymentIntentId').notEmpty().withMessage('Payment intent ID is required'),
  ],
  PaymentController.confirmPayment
);

// @route   GET /api/payments/history
// @desc    Get payment history
// @access  Private (Patient, Doctor, Admin)
router.get('/history', authenticate, PaymentController.getPaymentHistory);

// @route   POST /api/payments/refund
// @desc    Refund payment
// @access  Private (Patient, Admin)
router.post(
  '/refund',
  authenticate,
  [
    body('paymentId').notEmpty().withMessage('Payment ID is required'),
    body('amount').optional().isFloat({ min: 0 }).withMessage('Refund amount must be positive'),
    body('reason').optional().isIn(['duplicate', 'fraudulent', 'requested_by_customer']).withMessage('Invalid refund reason'),
  ],
  PaymentController.refundPayment
);

// @route   POST /api/payments/webhook
// @desc    Stripe webhook handler
// @access  Public (Stripe webhook)
router.post('/webhook', express.raw({ type: 'application/json' }), PaymentController.handleWebhook);

export default router;