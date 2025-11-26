# Starting the Backend Server

## Quick Start

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies (if not already done):**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   The server should start on `http://localhost:5000` (or the port specified in your `.env` file).

## Verify Backend is Running

Once the server is running, you should see:
```
Server running in development mode on 0.0.0.0:5000
```

You can test the connection by visiting:
- Health check: `http://localhost:5000/api/health`
- Ping endpoint: `http://localhost:5000/api/ping`

## Troubleshooting Network Errors

If you're getting network errors in the mobile app:

### For Android Emulator:
- The app should automatically use `http://10.0.2.2:5000/api`
- Make sure the backend is running on your host machine

### For Physical Android Device:
1. Find your computer's IP address:
   - **Windows**: Run `ipconfig` and look for IPv4 Address
   - **Mac/Linux**: Run `ifconfig` and look for inet address
2. Set the API URL in your app:
   - Create a `.env` file in `patient-app/` with:
     ```
     EXPO_PUBLIC_API_URL=http://YOUR_IP:5000/api
     ```
   - Replace `YOUR_IP` with your actual IP address (e.g., `192.168.1.100`)
3. Restart the Expo app

### For iOS Simulator:
- Should work with `localhost:5000`
- Make sure backend is running

### For Physical iOS Device:
- Same as physical Android - use your computer's IP address
- Ensure both devices are on the same Wi-Fi network

## Common Issues

1. **Port already in use:**
   - Change the port in `backend/.env` or use `PORT=5001 npm run dev`

2. **Firewall blocking connections:**
   - Allow Node.js through your firewall
   - On Windows: Windows Defender Firewall → Allow an app → Node.js

3. **Backend not accessible from device:**
   - Ensure backend is listening on `0.0.0.0` (not just `localhost`)
   - Check that both devices are on the same network
   - Try disabling VPN if active

## Environment Variables

Create a `.env` file in the `backend/` directory with:
```
PORT=5000
NODE_ENV=development
# Add your Supabase and other configuration here
```

