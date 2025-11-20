import express from 'express';
import { body, param } from 'express-validator';
import { VideoController } from '../controllers/video.controller';
import { authenticate, requirePatientOrDoctor } from '../middleware/auth.middleware';

const router = express.Router();

// @route   POST /api/video/create-room
// @desc    Create a new video room for appointment
// @access  Private (Patient or Doctor)
router.post(
  '/create-room',
  authenticate,
  requirePatientOrDoctor,
  [
    body('appointmentId').notEmpty().withMessage('Appointment ID is required'),
  ],
  VideoController.createVideoRoom
);

// @route   POST /api/video/join-room
// @desc    Join a video room and get access token
// @access  Private (Patient or Doctor)
router.post(
  '/join-room',
  authenticate,
  requirePatientOrDoctor,
  [
    body('roomId').notEmpty().withMessage('Room ID is required'),
  ],
  VideoController.joinVideoRoom
);

// @route   GET /api/video/room/:roomId
// @desc    Get video room status
// @access  Private (Patient or Doctor)
router.get(
  '/room/:roomId',
  authenticate,
  requirePatientOrDoctor,
  [
    param('roomId').notEmpty().withMessage('Room ID is required'),
  ],
  VideoController.getRoomStatus
);

// @route   POST /api/video/end-call
// @desc    End video call and complete room
// @access  Private (Patient or Doctor)
router.post(
  '/end-call',
  authenticate,
  requirePatientOrDoctor,
  [
    body('roomId').notEmpty().withMessage('Room ID is required'),
  ],
  VideoController.endVideoCall
);

// @route   GET /api/video/room/:roomId/participants
// @desc    Get room participants
// @access  Private (Patient or Doctor)
router.get(
  '/room/:roomId/participants',
  authenticate,
  requirePatientOrDoctor,
  [
    param('roomId').notEmpty().withMessage('Room ID is required'),
  ],
  VideoController.getRoomParticipants
);

export default router;