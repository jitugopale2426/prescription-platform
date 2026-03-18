# Prescription Platform

An online prescription platform where doctors and patients can connect. Patients can book consultations and receive digital prescriptions.

## Tech Stack

- **Frontend** - React, Vite
- **Backend** - Node.js, Express
- **Database** - MongoDB Atlas
- **Auth** - JWT

## Getting Started

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Create `.env` in backend folder:
```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
```

Create `.env` in frontend folder:
```
VITE_API_URL=http://localhost:5000
```

## Live Demo

- **Frontend** → https://prescription-platform.vercel.app
- **Backend API** → https://prescription-platform.onrender.com

## Test Credentials

### Doctors

| Name | Email | Password | Specialty |
|------|-------|----------|-----------|
| Dr. Rahul Sharma | rahul.sharma@gmail.com | Rahul@123 | Cardiologist |
| Dr. Sunil Kapoor | sunil.kapoor@example.com | Sunil@123 | Dermatologist |

### Patients

| Name | Email | Password |
|------|-------|----------|
| Aisha Khan | aisha.khan@example.com | Aisha@123 |
| Neha Verma | neha.verma@example.com | Neha@123 |

## Routes

### Doctor
- `POST /api/doctor/register` - Doctor signup
- `POST /api/doctor/login` - Doctor login
- `GET /api/doctor/profile` - Get doctor profile
- `GET /api/doctor/all` - List all doctors

### Patient
- `POST /api/patient/register` - Patient signup
- `POST /api/patient/login` - Patient login
- `GET /api/patient/profile` - Get patient profile

### Consultation
- `POST /api/consultation/create` - Submit consultation
- `GET /api/consultation/doctor` - Doctor view consultations
- `GET /api/consultation/patient` - Patient view consultations

### Prescription
- `POST /api/prescription/create` - Write prescription
- `PUT /api/prescription/update/:id` - Edit prescription
- `PUT /api/prescription/send/:id` - Send to patient
- `GET /api/prescription/patient` - Patient view prescriptions

## Pages

| URL | Description |
|-----|-------------|
| /doctor/signup | Doctor registration |
| /doctor/login | Doctor login |
| /doctor/profile | Doctor profile and info |
| /doctor/prescriptions | Write and manage prescriptions |
| /patient/signup | Patient registration |
| /patient/login | Patient login |
| /patient/doctors | View all doctors |
| /patient/consult/:id | Book consultation |
| /patient/prescriptions | View received prescriptions |