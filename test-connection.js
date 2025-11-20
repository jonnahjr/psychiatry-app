// Test script to check backend and database connection
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testConnection() {
  console.log('🔍 Testing Tele-Psychiatry System...\n');

  try {
    // Test 1: Health check
    console.log('1️⃣ Testing backend health...');
    const healthResponse = await axios.get(`${API_BASE}/health`);
    console.log('✅ Backend is running:', healthResponse.data.message);

    // Test 2: Login attempt
    console.log('\n2️⃣ Testing login...');
    const loginData = {
      email: 'admin@telepsychiatry.com',
      password: 'admin123'
    };

    const loginResponse = await axios.post(`${API_BASE}/auth/login`, loginData);
    console.log('✅ Login successful!');
    console.log('Token received:', loginResponse.data.token ? 'Yes' : 'No');
    console.log('User role:', loginResponse.data.data?.role);

  } catch (error) {
    console.log('\n❌ Test failed!');

    if (error.code === 'ECONNREFUSED') {
      console.log('🚫 Backend server is NOT running');
      console.log('💡 Solution: Run "cd backend && npm run dev"');
    } else if (error.response) {
      console.log('🚫 API Error:', error.response.status);
      console.log('Message:', error.response.data?.message);

      if (error.response.status === 401) {
        console.log('💡 Possible issues:');
        console.log('   - Wrong email/password');
        console.log('   - User does not exist in database');
        console.log('   - Database connection failed');
      }
    } else {
      console.log('🚫 Network Error:', error.message);
      console.log('💡 Make sure backend is running on port 5000');
    }
  }
}

testConnection();