import jwt from 'jsonwebtoken';
import UserModel from '../models/User';

export class AuthService {
  static generateToken(userId: string): string {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'fallback_secret', {
      expiresIn: process.env.JWT_EXPIRE || '30d',
    } as jwt.SignOptions);
  }

  static generateRefreshToken(userId: string): string {
    return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET || 'refresh_fallback_secret', {
      expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
    } as jwt.SignOptions);
  }

  static async getUserByEmail(email: string) {
    return UserModel.findOne({ email: email.toLowerCase() });
  }

  static async getUserById(id: string) {
    return UserModel.findById(id);
  }

  static async createUser(userData: {
    name: string;
    email: string;
    password: string;
    role: 'patient' | 'doctor' | 'admin';
  }) {
    const user = new UserModel(userData);
    return user.save();
  }

  static async updateUser(id: string, updateData: Partial<{
    name: string;
    email: string;
    role: 'patient' | 'doctor' | 'admin';
    is_active: boolean;
  }>) {
    return UserModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  static async deleteUser(id: string) {
    return UserModel.findByIdAndDelete(id);
  }

  static async getUsersByRole(role: string) {
    return UserModel.find({ role, is_active: true });
  }

  static async getAllUsers() {
    return UserModel.find({ is_active: true });
  }

  static async deactivateUser(id: string) {
    return UserModel.findByIdAndUpdate(id, { is_active: false }, { new: true });
  }

  static async activateUser(id: string) {
    return UserModel.findByIdAndUpdate(id, { is_active: true }, { new: true });
  }

  static sendTokenResponse(user: any, statusCode: number, res: any) {
    const token = this.generateToken(user._id);
    const refreshToken = this.generateRefreshToken(user._id);

    const options = {
      expires: new Date(
        Date.now() + (parseInt(process.env.JWT_COOKIE_EXPIRE || '30')) * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
    };

    // Remove password from output
    user.password = undefined;

    res
      .status(statusCode)
      .cookie('token', token, options)
      .json({
        success: true,
        token,
        refreshToken,
        data: user,
      });
  }
}