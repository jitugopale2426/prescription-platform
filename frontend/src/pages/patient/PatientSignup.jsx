import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../utils/api.js";
import "../../components/styles/auth.css";
import { getErrorMessage } from "../../utils/errorHandler.js";

function PatientSignup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    age: "",
    historyOfSurgery: "",
    historyOfIllness: "",
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setServerError("");
    setSuccess("");
    setErrors({ ...errors, [e.target.name]: "" });
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setServerError("");
    setSuccess("");
    const file = e.target.files[0];
    if (file) setProfilePicture(file);
  };

  useEffect(() => {
    return () => {
      if (profilePicture) URL.revokeObjectURL(profilePicture);
    };
  }, [profilePicture]);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";

    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (!formData.phone) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Enter a valid 10-digit phone number";

    if (!formData.age && formData.age !== 0) newErrors.age = "Age is required";
    else if (Number(formData.age) <= 0) newErrors.age = "Age must be positive";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setSuccess("");

    if (!validate()) return;

    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (profilePicture) data.append("profilePicture", profilePicture);

      await api.post("/patient/register", data);

      setSuccess("Registration successful! Redirecting to login...");
      setServerError("");
      setErrors({});

      setTimeout(() => {
        navigate("/patient/login");
      }, 2000);
    } catch (err) {
      setServerError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Patient Sign Up</h2>

        {serverError && <p className="auth-error">{serverError}</p>}
        {success && <p className="auth-success">{success}</p>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>
              Full Name <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter full name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && (
              <span className="auth-error small">{errors.name}</span>
            )}
          </div>

          <div className="form-group">
            <label>
              Email <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <span className="auth-error small">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label>
              Password <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <span className="auth-error small">{errors.password}</span>
            )}
          </div>

          <div className="form-group">
            <label>
              Phone Number <span style={{ color: "red" }}>*</span>
            </label>
            <div className="phone-input-wrapper">
              <input
                type="text"
                name="phone"
                placeholder="90000 00000"
                value={formData.phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setFormData({ ...formData, phone: value });
                  setErrors({ ...errors, phone: "" });
                  setServerError("");
                  setSuccess("");
                }}
              />
              <span className="phone-prefix">+91</span>
            </div>
            {errors.phone && (
              <span className="auth-error small">{errors.phone}</span>
            )}
          </div>

          <div className="form-group">
            <label>
              Age <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="number"
              name="age"
              placeholder="Enter age"
              value={formData.age}
              onChange={handleChange}
              min="0"
            />
            {errors.age && (
              <span className="auth-error small">{errors.age}</span>
            )}
          </div>

          <div className="form-group">
            <label>History of Surgery</label>
            <input
              type="text"
              name="historyOfSurgery"
              placeholder="Enter surgery history (if any)"
              value={formData.historyOfSurgery}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>History of Illness</label>
            <input
              type="text"
              name="historyOfIllness"
              placeholder="Separate illnesses by comma"
              value={formData.historyOfIllness}
              onChange={handleChange}
            />
            {formData.historyOfIllness && (
              <div className="illness-panel">
                {formData.historyOfIllness.split(",").map(
                  (item, index) =>
                    item.trim() && (
                      <span key={index} className="illness-tag">
                        {item.trim()}
                      </span>
                    )
                )}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Profile Picture (optional)</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {profilePicture && (
              <div className="profile-preview">
                <img
                  src={URL.createObjectURL(profilePicture)}
                  alt="Profile Preview"
                />
              </div>
            )}
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/patient/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default PatientSignup;