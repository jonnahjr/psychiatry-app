import { Request, Response, NextFunction } from 'express';
import Message from '../models/Message';
import Appointment from '../models/Appointment';
import { IAuthRequest } from '../types';

export class ChatController {
  static async getMessages(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      const { appointmentId } = req.params;

      if (!appointmentId) {
        return res.status(400).json({
          success: false,
          message: 'Appointment ID is required',
        });
      }

      // Verify user has access to this appointment
      const appointment = await Appointment.findById(appointmentId)
        .populate('patient', 'user')
        .populate('doctor', 'user');

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found',
        });
      }

      const userId = req.user!._id.toString();
      const patientUserId = (appointment.patient as any).user?.toString();
      const doctorUserId = (appointment.doctor as any).user?.toString();

      if (userId !== patientUserId && userId !== doctorUserId) {
        return res.status(403).json({
          success: false,
          message: 'You do not have access to this chat',
        });
      }

      const messages = await Message.find({ appointment: appointmentId })
        .populate('sender', 'name email role')
        .sort({ createdAt: 1 });

      res.status(200).json({
        success: true,
        data: messages,
      });
    } catch (error: any) {
      next(error);
    }
  }

  static async sendMessage(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      const { appointmentId, content, messageType, fileUrl, fileName } = req.body;

      if (!appointmentId || !content) {
        return res.status(400).json({
          success: false,
          message: 'Appointment ID and content are required',
        });
      }

      // Verify user has access to this appointment
      const appointment = await Appointment.findById(appointmentId)
        .populate('patient', 'user')
        .populate('doctor', 'user');

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found',
        });
      }

      const userId = req.user!._id.toString();
      const patientUserId = (appointment.patient as any).user?.toString();
      const doctorUserId = (appointment.doctor as any).user?.toString();

      if (userId !== patientUserId && userId !== doctorUserId) {
        return res.status(403).json({
          success: false,
          message: 'You do not have access to this chat',
        });
      }

      // Determine receiver
      const receiverId = userId === patientUserId ? doctorUserId : patientUserId;

      const message = new Message({
        sender: userId,
        receiver: receiverId,
        appointment: appointmentId,
        content,
        messageType: messageType || 'text',
        fileUrl,
        fileName,
      });

      await message.save();
      await message.populate('sender', 'name email role');

      res.status(201).json({
        success: true,
        data: message,
      });
    } catch (error: any) {
      next(error);
    }
  }

  static async markMessagesAsRead(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      const { appointmentId } = req.params;

      if (!appointmentId) {
        return res.status(400).json({
          success: false,
          message: 'Appointment ID is required',
        });
      }

      // Verify user has access to this appointment
      const appointment = await Appointment.findById(appointmentId)
        .populate('patient', 'user')
        .populate('doctor', 'user');

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found',
        });
      }

      const userId = req.user!._id.toString();
      const patientUserId = (appointment.patient as any).user?.toString();
      const doctorUserId = (appointment.doctor as any).user?.toString();

      if (userId !== patientUserId && userId !== doctorUserId) {
        return res.status(403).json({
          success: false,
          message: 'You do not have access to this chat',
        });
      }

      // Mark messages as read where current user is the receiver
      await Message.updateMany(
        {
          appointment: appointmentId,
          receiver: userId,
          isRead: false,
        },
        { isRead: true }
      );

      res.status(200).json({
        success: true,
        message: 'Messages marked as read',
      });
    } catch (error: any) {
      next(error);
    }
  }

  static async getUnreadCount(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!._id;

      const unreadCount = await Message.countDocuments({
        receiver: userId,
        isRead: false,
      });

      res.status(200).json({
        success: true,
        data: { unreadCount },
      });
    } catch (error: any) {
      next(error);
    }
  }

  static async getConversation(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const currentUserId = req.user!._id;
      const limit = parseInt(req.query.limit as string) || 50;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required',
        });
      }

      // Check if there's an appointment between these users
      const appointment = await Appointment.findOne({
        $or: [
          { patient: currentUserId, doctor: userId },
          { patient: userId, doctor: currentUserId },
        ],
      });

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'No appointment found between these users',
        });
      }

      const messages = await Message.find({
        appointment: appointment._id,
      })
        .populate('sender', 'name email role')
        .sort({ createdAt: -1 })
        .limit(limit);

      res.status(200).json({
        success: true,
        data: messages.reverse(), // Return in chronological order
      });
    } catch (error: any) {
      next(error);
    }
  }
}