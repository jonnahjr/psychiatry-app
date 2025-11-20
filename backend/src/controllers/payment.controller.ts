import { Request, Response, NextFunction } from 'express';
import { stripeService } from '../services/stripe.service';
import Payment from '../models/Payment';
import Appointment from '../models/Appointment';
import { IAuthRequest } from '../types';

export class PaymentController {
  static async createPaymentIntent(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      const { appointmentId, amount, currency = 'usd' } = req.body;

      if (!appointmentId || !amount) {
        return res.status(400).json({
          success: false,
          message: 'Appointment ID and amount are required',
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

      // Check if user is the patient
      const userId = req.user!._id.toString();
      const patientUserId = (appointment.patient as any).user?.toString();

      if (userId !== patientUserId) {
        return res.status(403).json({
          success: false,
          message: 'You can only pay for your own appointments',
        });
      }

      // Check if payment already exists
      const existingPayment = await Payment.findOne({
        appointment: appointmentId,
        status: { $in: ['pending', 'completed'] },
      });

      if (existingPayment) {
        return res.status(400).json({
          success: false,
          message: 'Payment already exists for this appointment',
        });
      }

      // Create Stripe payment intent
      const paymentIntent = await stripeService.createPaymentIntent(amount, currency, {
        appointmentId,
        patientId: userId,
        doctorId: (appointment.doctor as any).user?.toString(),
      });

      // Create payment record in database
      const payment = new Payment({
        patient: appointment.patient,
        appointment: appointmentId,
        amount,
        currency,
        status: 'pending',
        paymentMethod: 'stripe',
        stripePaymentIntentId: paymentIntent.id,
        description: `Payment for appointment on ${appointment.date.toDateString()}`,
      });

      await payment.save();

      res.status(201).json({
        success: true,
        data: {
          paymentIntent: {
            id: paymentIntent.id,
            client_secret: paymentIntent.client_secret,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
          },
          payment: {
            id: payment._id,
            status: payment.status,
          },
        },
      });
    } catch (error: any) {
      next(error);
    }
  }

  static async confirmPayment(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      const { paymentIntentId } = req.body;

      if (!paymentIntentId) {
        return res.status(400).json({
          success: false,
          message: 'Payment intent ID is required',
        });
      }

      // Retrieve payment from database
      const payment = await Payment.findOne({ stripePaymentIntentId: paymentIntentId });

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found',
        });
      }

      // Check if user owns this payment
      const userId = req.user!._id.toString();
      const patientId = (payment.patient as any).toString();

      if (userId !== patientId) {
        return res.status(403).json({
          success: false,
          message: 'You do not have access to this payment',
        });
      }

      // Retrieve payment intent from Stripe
      const paymentIntent = await stripeService.retrievePaymentIntent(paymentIntentId);

      // Update payment status based on Stripe status
      if (paymentIntent.status === 'succeeded') {
        payment.status = 'completed';
        payment.transactionId = paymentIntent.id;

        // Update appointment payment status
        await Appointment.findByIdAndUpdate(payment.appointment, {
          paymentStatus: 'paid',
        });
      } else if (paymentIntent.status === 'canceled') {
        payment.status = 'failed';
      }

      await payment.save();

      res.status(200).json({
        success: true,
        data: {
          payment: {
            id: payment._id,
            status: payment.status,
            transactionId: payment.transactionId,
          },
          stripeStatus: paymentIntent.status,
        },
      });
    } catch (error: any) {
      next(error);
    }
  }

  static async getPaymentHistory(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!._id;
      const userRole = req.user!.role;

      let query: any = {};

      if (userRole === 'patient') {
        query.patient = userId;
      } else if (userRole === 'doctor') {
        // For doctors, we need to find payments for appointments where they are the doctor
        const appointments = await Appointment.find({ doctor: userId }).select('_id');
        const appointmentIds = appointments.map(apt => apt._id);
        query.appointment = { $in: appointmentIds };
      } else {
        // Admin can see all payments
        query = {};
      }

      const payments = await Payment.find(query)
        .populate('patient', 'name email')
        .populate('appointment', 'date startTime endTime')
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        data: payments,
      });
    } catch (error: any) {
      next(error);
    }
  }

  static async refundPayment(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      const { paymentId, amount, reason } = req.body;

      if (!paymentId) {
        return res.status(400).json({
          success: false,
          message: 'Payment ID is required',
        });
      }

      // Find payment
      const payment = await Payment.findById(paymentId);

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found',
        });
      }

      // Check permissions (admin or payment owner)
      const userId = req.user!._id.toString();
      const userRole = req.user!.role;
      const patientId = (payment.patient as any).toString();

      if (userRole !== 'admin' && userId !== patientId) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to refund this payment',
        });
      }

      if (payment.status !== 'completed') {
        return res.status(400).json({
          success: false,
          message: 'Only completed payments can be refunded',
        });
      }

      // Create refund via Stripe
      const refund = await stripeService.createRefund(
        payment.stripePaymentIntentId!,
        amount,
        reason
      );

      // Update payment status
      payment.status = 'refunded';
      payment.metadata = {
        ...payment.metadata,
        refundId: refund.id,
        refundAmount: amount || payment.amount,
        refundReason: reason,
        refundedAt: new Date(),
      };

      await payment.save();

      // Update appointment payment status
      await Appointment.findByIdAndUpdate(payment.appointment, {
        paymentStatus: 'refunded',
      });

      res.status(200).json({
        success: true,
        data: {
          payment: {
            id: payment._id,
            status: payment.status,
            refundAmount: amount || payment.amount,
          },
          stripeRefund: {
            id: refund.id,
            status: refund.status,
          },
        },
      });
    } catch (error: any) {
      next(error);
    }
  }

  static async handleWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      const sig = req.headers['stripe-signature'] as string;
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

      if (!endpointSecret) {
        return res.status(500).json({
          success: false,
          message: 'Webhook secret not configured',
        });
      }

  // Construct the event
  const event = await stripeService.constructEvent(req.body, sig, endpointSecret);

      // Handle the event
      switch (event.type) {
        case 'payment_intent.succeeded':
          await PaymentController.handlePaymentIntentSucceeded(event.data.object);
          break;
        case 'payment_intent.payment_failed':
          await PaymentController.handlePaymentIntentFailed(event.data.object);
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      res.status(200).json({ received: true });
    } catch (error: any) {
      console.error('Webhook error:', error);
      res.status(400).json({
        success: false,
        message: 'Webhook error',
      });
    }
  }

  private static async handlePaymentIntentSucceeded(paymentIntent: any) {
    try {
      const payment = await Payment.findOne({ stripePaymentIntentId: paymentIntent.id });

      if (payment) {
        payment.status = 'completed';
        payment.transactionId = paymentIntent.id;
        await payment.save();

        // Update appointment
        await Appointment.findByIdAndUpdate(payment.appointment, {
          paymentStatus: 'paid',
        });
      }
    } catch (error) {
      console.error('Error handling payment success:', error);
    }
  }

  private static async handlePaymentIntentFailed(paymentIntent: any) {
    try {
      const payment = await Payment.findOne({ stripePaymentIntentId: paymentIntent.id });

      if (payment) {
        payment.status = 'failed';
        await payment.save();
      }
    } catch (error) {
      console.error('Error handling payment failure:', error);
    }
  }
}