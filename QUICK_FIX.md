# Quick Fix for Network Error

## The Problem
Your app is trying to connect to `http://10.0.2.2:5000/api` (Android emulator address) but getting network errors.

## ✅ Good News
Your backend IS running! I tested it and it's accessible on `localhost:5000`.

## 🔧 Solutions

### Solution 1: Use Expo Debugger Host (Recommended)
The app should automatically detect and use the correct IP address from Expo. If it's not working:

1. **Check what IP Expo is using:**
   - Look at the Expo terminal output when you start the app
   - It should show something like: `Metro waiting on exp://192.168.1.100:8081`

2. **Set the API URL manually:**
   - Create a `.env` file in `patient-app/` directory
   - Add: `EXPO_PUBLIC_API_URL=http://192.168.1.100:5000/api`
   - Replace `192.168.1.100` with the IP shown in Expo
   - Restart Expo: Stop and run `npm start` again

### Solution 2: Use Your Computer's IP Address
1. **Find your IP address:**
   - Windows: Open Command Prompt and run `ipconfig`
   - Look for "IPv4 Address" under your active network adapter
   - Example: `192.168.1.100`

2. **Set it in the app:**
   - Create `.env` file in `patient-app/` directory:
     ```
     EXPO_PUBLIC_API_URL=http://192.168.1.100:5000/api
     ```
   - Replace with your actual IP
   - Restart Expo

### Solution 3: Check Windows Firewall
The backend might be blocked by Windows Firewall:

1. Open Windows Defender Firewall
2. Click "Allow an app through firewall"
3. Find "Node.js" and make sure both Private and Public are checked
4. If Node.js isn't listed, click "Allow another app" and add it

### Solution 4: Verify Backend is Listening on All Interfaces
The backend should be listening on `0.0.0.0:5000` (all interfaces). Check the backend console - it should show:
```
Server running in development mode on 0.0.0.0:5000
```

If it shows `localhost:5000` or `127.0.0.1:5000`, that's the problem. The backend code already sets it to `0.0.0.0`, so this should be fine.

## 🧪 Test the Connection

Run this command to test if the backend is accessible:
```bash
node test-backend-connection.js
```

This will test multiple URLs and tell you which one works.

## 📱 For Physical Android Devices

If you're using a physical Android device (not emulator):
- You MUST use your computer's IP address (not `10.0.2.2`)
- Both devices must be on the same Wi-Fi network
- Use Solution 2 above

## 🚀 Quick Steps Right Now

1. **Find your IP:**
   ```bash
   ipconfig
   ```
   (Look for IPv4 Address)

2. **Create `.env` file in `patient-app/` folder:**
   ```
   EXPO_PUBLIC_API_URL=http://YOUR_IP:5000/api
   ```

3. **Restart Expo:**
   - Stop the current Expo process (Ctrl+C)
   - Run `npm start` again in `patient-app/`

4. **Try logging in again**

The app should now connect successfully!

