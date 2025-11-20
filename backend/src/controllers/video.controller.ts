import { Request, Response, NextFunction } from 'express';
import { twilioService } from '../services/twilio.service';
import Appointment from '../models/Appointment';
import { IAuthRequest } from '../types';

export class VideoController {
  static async createVideoRoom(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      const { appointmentId } = req.body;

      if (!appointmentId) {
        return res.status(400).json({
          success: false,
          message: 'Appointment ID is required',
        });
      }

      // Verify appointment exists and user has access
      const appointment = await Appointment.findById(appointmentId)
        .populate('patient', 'user')
        .populate('doctor', 'user');

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found',
        });
      }

      // Check if user is part of this appointment
      const userId = req.user!._id.toString();
      const patientUserId = (appointment.patient as any).user?.toString();
      const doctorUserId = (appointment.doctor as any).user?.toString();

      if (userId !== patientUserId && userId !== doctorUserId) {
        return res.status(403).json({
          success: false,
          message: 'You do not have access to this appointment',
        });
      }

      // Check if appointment is scheduled for today
      const today = new Date();
      const appointmentDate = new Date(appointment.date);
      const isToday = appointmentDate.toDateString() === today.toDateString();

      if (!isToday) {
        return res.status(400).json({
          success: false,
          message: 'Video calls can only be created for today\'s appointments',
        });
      }

      // Create video room
      const roomData = await twilioService.createVideoRoom(`appointment-${appointmentId}`);

      // Update appointment with video room ID
      appointment.videoRoomId = roomData.roomId;
      await appointment.save();

      res.status(201).json({
        success: true,
        data: {
          roomId: roomData.roomId,
          roomName: roomData.roomName,
          appointmentId,
        },
      });
    } catch (error: any) {
      next(error);
    }
  }

  static async joinVideoRoom(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      const { roomId } = req.body;

      if (!roomId) {
        return res.status(400).json({
          success: false,
          message: 'Room ID is required',
        });
      }

      // Find appointment with this room ID
      const appointment = await Appointment.findOne({ videoRoomId: roomId })
        .populate('patient', 'user')
        .populate('doctor', 'user');

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Video room not found',
        });
      }

      // Check if user is part of this appointment
      const userId = req.user!._id.toString();
      const patientUserId = (appointment.patient as any).user?.toString();
      const doctorUserId = (appointment.doctor as any).user?.toString();

      if (userId !== patientUserId && userId !== doctorUserId) {
        return res.status(403).json({
          success: false,
          message: 'You do not have access to this video room',
        });
      }

      // Generate access token
      const identity = req.user!.name;
      const roomName = `appointment-${appointment._id}`;

      const token = twilioService.generateAccessToken(identity, roomName);

      res.status(200).json({
        success: true,
        data: {
          token,
          roomName,
          appointmentId: appointment._id,
        },
      });
    } catch (error: any) {
      next(error);
    }
  }

  static async getRoomStatus(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      const { roomId } = req.params;

      if (!roomId) {
        return res.status(400).json({
          success: false,
          message: 'Room ID is required',
        });
      }

      const roomData = await twilioService.getRoom(roomId);

      res.status(200).json({
        success: true,
        data: roomData,
      });
    } catch (error: any) {
      next(error);
    }
  }

  static async endVideoCall(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      const { roomId } = req.body;

      if (!roomId) {
        return res.status(400).json({
          success: false,
          message: 'Room ID is required',
        });
      }

      // Find appointment with this room ID
      const appointment = await Appointment.findOne({ videoRoomId: roomId });

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Video room not found',
        });
      }

      // Check if user is part of this appointment
      const userId = req.user!._id.toString();
      const patientUserId = (appointment.patient as any).user?.toString();
      const doctorUserId = (appointment.doctor as any).user?.toString();

      if (userId !== patientUserId && userId !== doctorUserId) {
        return res.status(403).json({
          success: false,
          message: 'You do not have access to this video room',
        });
      }

      // Complete the room
      await twilioService.completeRoom(roomId);

      // Update appointment status to completed
      appointment.status = 'completed';
      await appointment.save();

      res.status(200).json({
        success: true,
        message: 'Video call ended successfully',
      });
    } catch (error: any) {
      next(error);
    }
  }

  static async getRoomParticipants(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      const { roomId } = req.params;

      if (!roomId) {
        return res.status(400).json({
          success: false,
          message: 'Room ID is required',
        });
      }

      const participants = await twilioService.getRoomParticipants(roomId);

      res.status(200).json({
        success: true,
        data: participants,
      });
    } catch (error: any) {
      next(error);
    }
  }
}