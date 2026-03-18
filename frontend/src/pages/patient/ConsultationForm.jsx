import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api.js";
import "../../components/styles/consultation.css";
import { getErrorMessage } from "../../utils/errorHandler.js";

function ConsultationForm() {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    currentIllness: "",
    recentSurgery: "",
    isDiabetic: null,
    allergies: "",
    others: "",
    transactionId: "",
  });

  const handleChange = (e) => {
    setError("");
    const value =
      e.target.type === "radio" ? e.target.value === "yes" : e.target.value;

    setFormData({ ...formData, [e.target.name]: value });
  };

  const validateStep = (currentStep) => {
    if (currentStep === 1) {
      if (!formData.currentIllness.trim()) {
        setError("Please describe your current illness.");
        return false;
      }
    }

    if (currentStep === 2) {
      if (formData.isDiabetic === null) {
        setError("Please select whether you are diabetic or not.");
        return false;
      }
    }

    if (currentStep === 3) {
      if (!formData.transactionId.trim()) {
        setError("Transaction ID is required.");
        return false;
      }
      if (!consentAccepted) {
        setError("You must accept the consent to proceed.");
        return false;
      }
    }

    setError("");
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setLoading(true);
    setError("");

    try {
      await api.post("/consultation/create", {
        ...formData,
        doctorId,
      });

      setError("");
      setSuccess("Appointment submitted successfully!");

      setTimeout(() => {
        navigate("/patient/doctors");
      }, 2000);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="consultation-container">
      <div className="consultation-box">
        <h2>Consultation Form</h2>

        <div className="step-indicators">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`step-circle ${step >= s ? "active" : ""}`}>
              {s}
            </div>
          ))}
        </div>

        {error && <p className="form-error">{error}</p>}
        {success && <p className="form-success">{success}</p>}

        {step === 1 && (
          <div>
            <h3>Current Health Details</h3>

            <textarea
              name="currentIllness"
              placeholder="Describe your current illness *"
              value={formData.currentIllness}
              onChange={handleChange}
            />

            <input
              type="text"
              name="recentSurgery"
              placeholder="Recent surgery (mention time span)"
              value={formData.recentSurgery}
              onChange={handleChange}
            />

            <button className="btn-next" onClick={handleNext}>
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3>Family Medical History</h3>

            <span className="radio-label">Are you Diabetic? *</span>

            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="isDiabetic"
                  value="yes"
                  checked={formData.isDiabetic === true}
                  onChange={handleChange}
                />
                Diabetic
              </label>

              <label>
                <input
                  type="radio"
                  name="isDiabetic"
                  value="no"
                  checked={formData.isDiabetic === false}
                  onChange={handleChange}
                />
                Non-Diabetic
              </label>
            </div>

            <input
              type="text"
              name="allergies"
              placeholder="Any Allergies"
              value={formData.allergies}
              onChange={handleChange}
            />

            <input
              type="text"
              name="others"
              placeholder="Others"
              value={formData.others}
              onChange={handleChange}
            />

            <div className="button-group">
              <button className="btn-back" onClick={handleBack}>
                Back
              </button>

              <button className="btn-next" onClick={handleNext}>
                Next
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3>Payment</h3>

            <div className="qr-box">
              <p>Scan and Pay using UPI App</p>
              <div className="qr-placeholder">QR Code</div>
              <p>UPI ID: doctor@upi</p>
              <p className="amount">₹ 600</p>
              <p>(After Payment)</p>
            </div>

            <input
              type="text"
              name="transactionId"
              placeholder="Enter Transaction ID *"
              value={formData.transactionId}
              onChange={handleChange}
            />

            <div className="consent-box">
              <p className="consent-title">CONSENT FOR ONLINE CONSULTATION</p>

              <p className="consent-desc">
                I have understood that this is an online consultation without a
                physical checkup of my symptoms. The doctor hence relies on my
                description of the problem or scanned reports provided by me.
                With this understanding, I hereby give my consent for online
                consultation.
              </p>

              <label className="consent-check">
                <input
                  type="checkbox"
                  checked={consentAccepted}
                  onChange={(e) => {
                    setError("");
                    setConsentAccepted(e.target.checked);
                  }}
                />
                YES, I ACCEPT *
              </label>
            </div>

            <div className="button-group">
              <button className="btn-back" onClick={handleBack}>
                Back
              </button>

              <button
                className="btn-submit"
                disabled={loading}
                onClick={handleSubmit}
              >
                {loading ? "Submitting..." : "Submit Appointment"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConsultationForm;
