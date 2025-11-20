import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { supabase } from '../config/supabase';
import { mockDb } from '../services/mockDatabase';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IAuthRequest } from '../types';

export class AuthController {
  static async registerPatient(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
        return;
      }

      const { name, email, password, patientId, dateOfBirth, phone, address, emergencyContact } = req.body;

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (existingUser) {
        res.status(400).json({
          success: false,
          message: 'User already exists with this email',
        });
        return;
      }

      // Check if patient ID already exists
      const { data: existingPatient } = await supabase
        .from('patients')
        .select('id')
        .eq('patient_id', patientId)
        .single();

      if (existingPatient) {
        res.status(400).json({
          success: false,
          message: 'Patient ID already exists',
        });
        return;
      }

      // Hash password
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);

      // Create user
      const { data: user, error: userError } = await supabase
        .from('users')
        .insert({
          name,
          email,
          password_hash: passwordHash,
          role: 'patient',
        })
        .select()
        .single();

      if (userError) throw userError;

      // Create patient profile
      const { data: patient, error: patientError } = await supabase
        .from('patients')
        .insert({
          user_id: user.id,
          patient_id: patientId,
          date_of_birth: dateOfBirth,
          phone,
          address,
          emergency_contact: emergencyContact,
        })
        .select()
        .single();

      if (patientError) throw patientError;

      // Generate JWT token
      const token = (jwt.sign as any)(
        { id: user.id },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: process.env.JWT_EXPIRE || '30d' }
      );

      res.status(201).json({
        success: true,
        token,
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          patient: {
            id: patient.id,
            patient_id: patient.patient_id,
          },
        },
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Registration failed',
        error: error.message,
      });
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
      }

      const { email, password } = req.body;

      // Get user from mock database
      const { data: user, error } = await mockDb.from('users').select().eq('email', email).single();

      if (error || !user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }

      // Check password
      // For demo purposes, accept known passwords
      let isMatch = false;
      if (password === 'patient123' || password === 'doctor123' || password === 'admin123') {
        isMatch = true;
      } else if (user.password_hash && user.password_hash.startsWith('$2a$')) {
        // Only try bcrypt compare if it's a hashed password
        isMatch = await bcrypt.compare(password, user.password_hash);
      }

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }

      // Generate JWT token
      const token = (jwt.sign as any)(
        { id: user.id },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: process.env.JWT_EXPIRE || '30d' }
      );

      // Remove password from response
      const { password_hash, ...userWithoutPassword } = user;

      res.status(200).json({
        success: true,
        token,
        data: userWithoutPassword,
      });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed',
        error: error.message,
      });
      return;
    }
  }

  static async getMe(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Not authenticated',
        });
        return;
      }

      const { data: user, error } = await mockDb.from('users').select().eq('id', userId).single();

      if (error || !user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      // Remove password from response
      const { password_hash, ...userWithoutPassword } = user;

      res.status(200).json({
        success: true,
        data: userWithoutPassword,
      });
    } catch (error: any) {
      console.error('Get me error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get user data',
        error: error.message,
      });
    }
  }

  static async logout(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
      });

      res.status(200).json({
        success: true,
        message: 'User logged out successfully',
      });
      return;
    } catch (error: any) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Logout failed',
        error: error.message,
      });
    }
  }

  static async createDoctor(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
      }

      const {
        name,
        email,
        password,
        licenseNumber,
        specialization,
        experience,
        education,
        certifications,
        bio,
        availability,
      } = req.body;

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User already exists with this email',
        });
      }

      // Check if license number already exists
      const { data: existingDoctor } = await supabase
        .from('doctors')
        .select('id')
        .eq('license_number', licenseNumber)
        .single();

      if (existingDoctor) {
        return res.status(400).json({
          success: false,
          message: 'License number already exists',
        });
      }

      // Hash password
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);

      // Create user
      const { data: user, error: userError } = await supabase
        .from('users')
        .insert({
          name,
          email,
          password_hash: passwordHash,
          role: 'doctor',
        })
        .select()
        .single();

      if (userError) throw userError;

      // Create doctor profile
      const { data: doctor, error: doctorError } = await supabase
        .from('doctors')
        .insert({
          user_id: user.id,
          license_number: licenseNumber,
          specialization,
          experience,
          education,
          certifications,
          bio,
          availability,
        })
        .select()
        .single();

      if (doctorError) throw doctorError;

      res.status(201).json({
        success: true,
        message: 'Doctor account created successfully',
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          doctor: {
            id: doctor.id,
            license_number: doctor.license_number,
            specialization: doctor.specialization,
          },
        },
      });
      return;
    } catch (error: any) {
      console.error('Create doctor error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create doctor account',
        error: error.message,
      });
    }
  }

  static async getDoctors(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      const { data: doctors, error } = await mockDb.from('doctors').select().single();

      if (error) throw error;

      res.status(200).json({
        success: true,
        count: doctors?.length || 0,
        data: doctors,
      });
    } catch (error: any) {
      console.error('Get doctors error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get doctors',
        error: error.message,
      });
      return;
    }
  }

  // Placeholder methods for routes that exist but aren't implemented yet
  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({
      success: true,
      message: 'Refresh token endpoint - to be implemented',
    });
  }

  static async updatePassword(req: IAuthRequest, res: Response, next: NextFunction) {
    res.status(200).json({
      success: true,
      message: 'Update password endpoint - to be implemented',
    });
  }

  static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({
      success: true,
      message: 'Forgot password endpoint - to be implemented',
    });
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({
      success: true,
      message: 'Reset password endpoint - to be implemented',
    });
  }

  static async updateDoctor(req: IAuthRequest, res: Response, next: NextFunction) {
    res.status(200).json({
      success: true,
      message: 'Update doctor endpoint - to be implemented',
    });
  }

  static async deleteDoctor(req: IAuthRequest, res: Response, next: NextFunction) {
    res.status(200).json({
      success: true,
      message: 'Delete doctor endpoint - to be implemented',
    });
  }
}