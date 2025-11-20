import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Mock external services for testing
jest.mock('../services/twilio.service');
jest.mock('../services/stripe.service');

// Set test timeout
jest.setTimeout(10000);