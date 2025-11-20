// Simple test script to check if the backend is working
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testLogin() {
  try {
    console.log('Testing backend connection...');

    // Test health check
    const healthResponse = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health check passed:', healthResponse.data);

    // Test login with default credentials
    const loginData = {
      email: 'admin@telepsychiatry.com',
      password: 'admin123'
    };

    console.log('Testing login...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, loginData);
    console.log('✅ Login successful:', loginResponse.data);

  } catch (error) {
    console.error('❌ Test failed:');
    if (error.code === 'ECONNREFUSED') {
      console.error('Backend server is not running. Start it with: cd backend && npm run dev');
    } else if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    } else {
      console.error('Network Error:', error.message);
    }
  }
}

testLogin();