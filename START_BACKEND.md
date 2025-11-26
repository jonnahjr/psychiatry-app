# How to Start the Backend Server

## The Problem
The backend server needs to be running for the mobile app to connect.

## Solution

### Step 1: Open a New Terminal Window
Keep this terminal open and running the backend.

### Step 2: Navigate to Backend Directory
```bash
cd backend
```

### Step 3: Start the Backend Server
```bash
npm run dev
```

You should see output like:
```
Server running in development mode on 0.0.0.0:5000
```

### Step 4: Keep It Running
**DO NOT close this terminal** - the backend must stay running while you use the app.

### Step 5: Test the Connection
In another terminal, run:
```bash
node test-backend-connection.js
```

You should see:
```
✅ SUCCESS: http://localhost:5000/api/health
```

## If Backend Won't Start

1. **Check for errors** in the terminal output
2. **Check if port 5000 is already in use:**
   ```bash
   netstat -ano | findstr :5000
   ```
3. **Install dependencies if needed:**
   ```bash
   cd backend
   npm install
   ```

## Important Notes

- ✅ Backend port is now set to **5000** (was 5001)
- ✅ Backend listens on **0.0.0.0** (all network interfaces)
- ✅ CORS is configured to allow all origins in development
- ✅ The backend must be running before using the mobile app

## Quick Start Command
```bash
cd backend && npm run dev
```

