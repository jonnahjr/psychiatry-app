# Tele-Psychiatry System

A complete, production-ready Tele-Psychiatry platform with mobile apps for patients and doctors, web admin portal, and comprehensive backend services.

## Architecture Overview

- **Frontend**: React Native (Mobile Apps) + React.js (Web Admin Portal) + TypeScript
- **Backend**: Node.js + Express + TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based with role-based access control
- **Real-time**: Socket.io for chat and notifications
- **Video Calls**: WebRTC (peer-to-peer)
- **Payments**: Stripe integration
- **UI**: Tailwind CSS + ShadCN UI + Glassmorphism design

## Project Structure

```
tele-psychiatry-system/
├── backend/                 # Node.js API Server
├── patient-app/            # Unified Mobile App (React Native + Expo)
├── admin-portal/           # Admin Web Portal (React.js)
├── shared/                 # Shared components and utilities
└── docs/                   # Documentation
```

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase account (for database)
- Expo CLI (for mobile development)
- Docker & Docker Compose (for production deployment)

### Quick Start with Docker (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd tele-psychiatry-system

# Start all services
./deploy.sh

# Or using docker-compose directly
docker-compose up -d --build
```

**Services will be available at:**
- Admin Portal: http://localhost:3000
- Backend API: http://localhost:5000
- Supabase: localhost:54322

### Manual Installation

```bash
# Install backend dependencies
cd backend
npm install

# Install mobile app dependencies with Expo
cd ../patient-app
npm install
npx expo install --fix

# Install admin portal dependencies
cd ../admin-portal
npm install
```

### Environment Setup
Create `.env` files in each directory based on the provided `.env.example` files.

### Running the Application Manually
```bash
# Terminal 1: Start backend server
cd backend && npm run dev

# Terminal 2: Start admin portal
cd admin-portal && npm run dev

# Terminal 3: Start mobile app (requires mobile device/emulator)
cd patient-app && npx expo start
```

### Deployment Commands

```bash
# Start services
./deploy.sh

# Stop services
./deploy.sh stop

# View logs
./deploy.sh logs [service-name]

# Check status
./deploy.sh status

# Restart services
./deploy.sh restart

# Cleanup (removes containers, volumes, images)
./deploy.sh cleanup
```

## Features

### Unified Mobile App (Patient & Doctor)
**For Patients:**
- Registration and authentication
- Doctor search and booking
- Video consultations
- Prescription viewing
- Medical history management
- Real-time messaging

**For Doctors:**
- Admin-assigned account access
- Patient management dashboard
- Prescription writing
- Appointment scheduling
- Medical record updates

### Admin Web Portal
- User management (patients, doctors)
- System analytics and reporting
- Content management
- Financial reporting
- System configuration

## Technology Stack

- **Frontend**: React Native (Expo) + React.js, TypeScript, Tailwind CSS, ShadCN UI
- **Backend**: Node.js, Express, TypeScript, Socket.io
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT, bcrypt
- **Real-time**: Socket.io
- **Video**: WebRTC (peer-to-peer with Socket.IO signaling)
- **Payments**: Stripe API
- **UI/UX**: Glassmorphism design, smooth animations, dark mode

## Security Features

- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- CORS configuration
- Rate limiting
- Secure password hashing

## Contributing

Please read the contributing guidelines in the `docs/` directory.

## License

This project is licensed under the MIT License.