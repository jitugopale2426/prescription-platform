import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../utils/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import "../../components/styles/auth.css";
import { getErrorMessage } from "../../utils/errorHandler.js";

function DoctorLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setServerError("");
    setErrors({ ...errors, [e.target.name]: "" });
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    setLoading(true);
    try {
      const res = await api.post("/doctor/login", formData);
      login(res.data.doctor, "doctor", res.data.token);
      navigate("/doctor/profile");
    } catch (err) {
      setServerError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Doctor Login</h2>

        {serverError && <p className="auth-error">{serverError}</p>}

        <form onSubmit={handleSubmit} noValidate>
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

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-link">
          New doctor? <Link to="/doctor/signup">Register here</Link>
        </p>

        <p className="auth-link">
          Are you a patient? <Link to="/patient/login">Login as patient</Link>
        </p>
      </div>
    </div>
  );
}

export default DoctorLogin;
