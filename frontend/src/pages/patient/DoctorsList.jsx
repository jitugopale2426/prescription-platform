import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../../utils/api.js"
import { useAuth } from "../../context/AuthContext.jsx"
import "../../components/styles/doctors.css"
import { getErrorMessage } from "../../utils/errorHandler.js"

function DoctorsList() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchDoctors()
  }, [])

  const fetchDoctors = async () => {
    try {
      const res = await api.get("/doctor/all")
      setDoctors(res.data || [])
    } catch (err) {
      setError(getErrorMessage(err)) 
    } finally {
      setLoading(false)
    }
  }

  const handleConsult = (doctorId) => {
    navigate(`/patient/consult/${doctorId}`)
  }

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading doctors...</p>
  }

  if (error) {
    return (
      <p style={{ textAlign: "center", color: "red" }}>
        {error}
      </p>
    )
  }

  return (
    <div className="doctors-container">
      <div className="doctors-header">
        <h2>Available Doctors</h2>

        <div className="header-right">
          <span>Welcome, {user?.name}</span>

          <button
            className="btn-prescription"
            onClick={() => navigate("/patient/prescriptions")}
          >
            My Prescriptions
          </button>

          <button className="btn-logout" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      <div className="doctors-grid">
        {doctors.length === 0 ? (
          <p>No doctors available</p>
        ) : (
          doctors.map((doctor) => (
            <div key={doctor._id} className="doctor-card">
              <img
                src={
                  doctor.profilePicture
                    ? `${import.meta.env.VITE_API_URL}/uploads/${doctor.profilePicture}` 
                    : "https://via.placeholder.com/100"
                }
                alt={doctor.name}
                className="doctor-avatar"
              />

              <h3 className="doctor-name">{doctor.name}</h3>
              <p className="doctor-specialty">{doctor.specialty}</p>

              <p className="doctor-experience">
                {doctor.experience} years experience
              </p>

              <button
                className="btn-consult"
                onClick={() => handleConsult(doctor._id)}
              >
                Consult
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default DoctorsList