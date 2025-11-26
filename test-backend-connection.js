// Quick script to test if backend is accessible
const axios = require('axios');

const testUrls = [
  'http://localhost:5000/api/health',
  'http://127.0.0.1:5000/api/health',
  'http://10.0.2.2:5000/api/health', // Android emulator
];

async function testConnection() {
  console.log('🔍 Testing backend connection...\n');
  
  for (const url of testUrls) {
    try {
      console.log(`Testing: ${url}`);
      const response = await axios.get(url, { timeout: 5000 });
      console.log(`✅ SUCCESS: ${url}`);
      console.log(`   Response:`, response.data);
      console.log('');
      return true;
    } catch (error) {
      console.log(`❌ FAILED: ${url}`);
      if (error.code === 'ECONNREFUSED') {
        console.log('   Error: Connection refused - backend may not be running');
      } else if (error.code === 'ETIMEDOUT') {
        console.log('   Error: Connection timeout');
      } else {
        console.log(`   Error: ${error.message}`);
      }
      console.log('');
    }
  }
  
  console.log('⚠️  All connection attempts failed!');
  console.log('\n💡 Make sure:');
  console.log('   1. Backend server is running (cd backend && npm run dev)');
  console.log('   2. Server is listening on port 5000');
  console.log('   3. No firewall is blocking the connection');
  return false;
}

testConnection().then(success => {
  process.exit(success ? 0 : 1);
});

