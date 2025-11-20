import express from 'express';
import { body, param, query } from 'express-validator';
import { ChatController } from '../controllers/chat.controller';
import { authenticate, requirePatientOrDoctor } from '../middleware/auth.middleware';

const router = express.Router();

// @route   GET /api/chat/messages/:appointmentId
// @desc    Get messages for an appointment
// @access  Private (Patient or Doctor)
router.get(
  '/messages/:appointmentId',
  authenticate,
  requirePatientOrDoctor,
  [
    param('appointmentId').notEmpty().withMessage('Appointment ID is required'),
  ],
  ChatController.getMessages
);

// @route   POST /api/chat/messages
// @desc    Send a message
// @access  Private (Patient or Doctor)
router.post(
  '/messages',
  authenticate,
  requirePatientOrDoctor,
  [
    body('appointmentId').notEmpty().withMessage('Appointment ID is required'),
    body('content').notEmpty().withMessage('Message content is required'),
    body('messageType').optional().isIn(['text', 'image', 'file']).withMessage('Invalid message type'),
  ],
  ChatController.sendMessage
);

// @route   PUT /api/chat/messages/:appointmentId/read
// @desc    Mark messages as read
// @access  Private (Patient or Doctor)
router.put(
  '/messages/:appointmentId/read',
  authenticate,
  requirePatientOrDoctor,
  [
    param('appointmentId').notEmpty().withMessage('Appointment ID is required'),
  ],
  ChatController.markMessagesAsRead
);

// @route   GET /api/chat/unread-count
// @desc    Get unread message count
// @access  Private (Patient or Doctor)
router.get(
  '/unread-count',
  authenticate,
  requirePatientOrDoctor,
  ChatController.getUnreadCount
);

// @route   GET /api/chat/conversation/:userId
// @desc    Get conversation with another user
// @access  Private (Patient or Doctor)
router.get(
  '/conversation/:userId',
  authenticate,
  requirePatientOrDoctor,
  [
    param('userId').notEmpty().withMessage('User ID is required'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  ],
  ChatController.getConversation
);

export default router;