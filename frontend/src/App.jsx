import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";

import DoctorSignup from "./pages/doctor/DoctorSignup.jsx";
import DoctorLogin from "./pages/doctor/DoctorLogin.jsx";
import DoctorProfile from "./pages/doctor/DoctorProfile.jsx";
import PrescriptionPage from "./pages/doctor/PrescriptionPage.jsx";

import PatientSignup from "./pages/patient/PatientSignup.jsx";
import PatientLogin from "./pages/patient/PatientLogin.jsx";
import DoctorsList from "./pages/patient/DoctorsList.jsx";
import ConsultationForm from "./pages/patient/ConsultationForm.jsx";
import MyPrescriptions from "./pages/patient/MyPrescriptions.jsx";

function App() {
  const { user, role } = useAuth();

  return (
    <Routes>
      {/* default route */}
      <Route path="/" element={<Navigate to="/patient/login" />} />

      {/* doctor routes */}
      <Route path="/doctor/signup" element={<DoctorSignup />} />
      <Route path="/doctor/login" element={<DoctorLogin />} />
      <Route
        path="/doctor/profile"
        element={
          user && role === "doctor" ? (
            <DoctorProfile />
          ) : (
            <Navigate to="/doctor/login" />
          )
        }
      />
      <Route
        path="/doctor/prescriptions"
        element={
          user && role === "doctor" ? (
            <PrescriptionPage />
          ) : (
            <Navigate to="/doctor/login" />
          )
        }
      />

      {/* patient routes */}
      <Route path="/patient/signup" element={<PatientSignup />} />
      <Route path="/patient/login" element={<PatientLogin />} />
      <Route
        path="/patient/doctors"
        element={
          user && role === "patient" ? (
            <DoctorsList />
          ) : (
            <Navigate to="/patient/login" />
          )
        }
      />
      <Route
        path="/patient/consult/:doctorId"
        element={
          user && role === "patient" ? (
            <ConsultationForm />
          ) : (
            <Navigate to="/patient/login" />
          )
        }
      />
      <Route
        path="/patient/prescriptions"
        element={
          user && role === "patient" ? (
            <MyPrescriptions/>
          ) : (
            <Navigate to="/patient/login" />
          )
        }
      />
    </Routes>
  );
}

export default App;
