import { AuthService } from '../../services/auth.service';
import User from '../../models/User';

jest.mock('../../models/User');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateToken', () => {
    it('should generate a JWT token', () => {
      const userId = 'user123';
      const token = AuthService.generateToken(userId);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });
  });

  describe('getUserByEmail', () => {
    it('should return user by email', async () => {
      const mockUser = { email: 'test@example.com', name: 'Test User' };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await AuthService.getUserByEmail('test@example.com');

      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      const result = await AuthService.getUserByEmail('notfound@example.com');

      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create and save a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'patient' as const,
      };

      const mockSavedUser = { ...userData, _id: 'user123' };
      const mockUserInstance = {
        ...userData,
        save: jest.fn().mockResolvedValue(mockSavedUser),
      };

      (User as jest.Mock).mockImplementation(() => mockUserInstance);

      const result = await AuthService.createUser(userData);

      expect(User).toHaveBeenCalledWith(userData);
      expect(mockUserInstance.save).toHaveBeenCalled();
      expect(result).toEqual(mockSavedUser);
    });
  });
});