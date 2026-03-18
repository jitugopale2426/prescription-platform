import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../../utils/api.js"
import { useAuth } from "../../context/AuthContext.jsx"
import "../../components/styles/profile.css"
import { getErrorMessage } from "../../utils/errorHandler.js"

function DoctorProfile() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await api.get("/doctor/profile")
      setDoctor(res.data || null)
    } catch (err) {
      setError(getErrorMessage(err)) 
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading profile...</p>
  }

  if (error) {
    return (
      <p style={{ textAlign: "center", color: "red" }}>
        {error}
      </p>
    )
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Doctor Profile</h2>

        <button className="btn-logout" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="profile-card">
        <img
          src={
            doctor?.profilePicture
              ? `${import.meta.env.VITE_API_URL}/uploads/${doctor.profilePicture}`
              : "https://via.placeholder.com/150"
          }
          alt="Profile"
          className="profile-avatar"
        />

        <div className="profile-info">
          <h3>{doctor?.name}</h3>
          <p className="specialty">{doctor?.specialty}</p>
          <p>Email: {doctor?.email}</p>
          <p>Phone: {doctor?.phone}</p>
          <p>Experience: {doctor?.experience} years</p>
        </div>
      </div>

      <button
        className="btn-prescription-page"
        onClick={() => navigate("/doctor/prescriptions")}
      >
        Go to Prescription Page
      </button>
    </div>
  )
}

export default DoctorProfile;