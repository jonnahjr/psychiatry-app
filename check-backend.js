// Quick script to check if backend is running and accessible
const axios = require('axios');

// Get IP and port from command line args or use defaults
const IP = process.argv[2] || '192.168.80.119';
const PORT = process.argv[3] || '5000';
const API_URL = `http://${IP}:${PORT}/api`;

console.log('🔍 Checking backend connection...\n');
console.log(`📍 Testing: ${API_URL}\n`);

async function checkBackend() {
  try {
    // Test health endpoint
    console.log('1️⃣ Testing /health endpoint...');
    const healthResponse = await axios.get(`${API_URL}/health`, { timeout: 5000 });
    console.log('✅ Health check passed:', healthResponse.data);
    
    // Test login endpoint (without credentials, just check if it exists)
    console.log('\n2️⃣ Testing /auth/login endpoint...');
    try {
      await axios.post(`${API_URL}/auth/login`, { email: 'test', password: 'test' }, { timeout: 5000 });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Login endpoint is accessible (401 is expected for invalid credentials)');
      } else if (error.response) {
        console.log('✅ Login endpoint responded:', error.response.status);
      } else {
        throw error;
      }
    }
    
    console.log('\n✅✅✅ Backend is running and accessible! ✅✅✅');
    console.log(`\n💡 Use this URL in your app: ${API_URL}`);
    
  } catch (error) {
    console.log('\n❌❌❌ Backend connection failed! ❌❌❌\n');
    
    if (error.code === 'ECONNREFUSED') {
      console.log('🚫 Connection refused - Backend server is NOT running');
      console.log('\n💡 Solution:');
      console.log('   1. Open a terminal in the backend folder');
      console.log('   2. Run: npm run dev');
      console.log('   3. Wait for "Server running" message');
    } else if (error.code === 'ETIMEDOUT' || error.message.includes('timeout')) {
      console.log('🚫 Connection timeout - Server might be slow or unreachable');
      console.log('\n💡 Check:');
      console.log('   1. Is the backend running?');
      console.log('   2. Is the IP address correct?');
      console.log('   3. Is there a firewall blocking the connection?');
    } else if (error.code === 'ENOTFOUND') {
      console.log('🚫 Host not found - IP address might be incorrect');
      console.log(`\n💡 The IP "${IP}" could not be resolved`);
      console.log('   Try using your actual local IP address');
    } else {
      console.log('🚫 Error:', error.message);
      console.log('   Code:', error.code);
    }
    
    console.log('\n📝 Usage:');
    console.log(`   node check-backend.js [IP] [PORT]`);
    console.log(`   Example: node check-backend.js 192.168.1.100 5000`);
    
    process.exit(1);
  }
}

checkBackend();

