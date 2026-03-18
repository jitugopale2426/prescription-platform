import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import "../../components/styles/prescription.css";
import { getErrorMessage } from "../../utils/errorHandler.js";
import jsPDF from "jspdf";

function PrescriptionPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [consultations, setConsultations] = useState([]);
  const [success, setSuccess] = useState("");
  const [selected, setSelected] = useState(null);
  const [prescriptionForm, setPrescriptionForm] = useState({
    careToBeTaken: "",
    medicines: "",
  });
  const [existingPrescription, setExistingPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      const res = await api.get("/consultation/doctor");
      setConsultations(res.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSelectConsultation = async (consultation) => {
    setSelected(consultation);
    setError("");
    try {
      const res = await api.get(
        `/prescription/consultation/${consultation._id}`,
      );
      setExistingPrescription(res.data);
      setPrescriptionForm({
        careToBeTaken: res.data.careToBeTaken,
        medicines: res.data.medicines,
      });
    } catch (err) {
      console.log(err);
      setExistingPrescription(null);
      setPrescriptionForm({ careToBeTaken: "", medicines: "" });
    }
  };

  const handleSavePrescription = async () => {
    if (!prescriptionForm.careToBeTaken) {
      setError("Care to be taken is required");
      return;
    }
    setSaving(true);
    try {
      if (existingPrescription) {
        await api.put(
          `/prescription/update/${existingPrescription._id}`,
          prescriptionForm,
        );
      } else {
        await api.post("/prescription/create", {
          consultationId: selected._id,
          patientId: selected.patientId._id,
          ...prescriptionForm,
        });
      }
      setSuccess("Prescription saved successfully");
      setTimeout(() => {
        setSuccess("");
      }, 3000);
      fetchConsultations();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleSendToPatient = async () => {
    try {
      await api.put(`/prescription/send/${existingPrescription._id}`);
      setSuccess("Prescription sent to patient!");
      setTimeout(() => {
      setSuccess("");
    }, 3000);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleGeneratePDF = () => {
    const doc = new jsPDF();

    const doctorName = selected?.doctorId?.name || "Doctor";
    const patientName = selected?.patientId?.name || "patient";
    const date = new Date().toLocaleDateString();

    doc.setFontSize(14);
    doc.text(`Dr. ${doctorName}`, 10, 15);

    doc.setFontSize(10);
    doc.text(`Date: ${date}`, 150, 15);

    doc.setFillColor(0, 0, 128);
    doc.rect(10, 20, 190, 3, "F");

    doc.setFontSize(11);
    doc.text("Care to be taken", 10, 35);

    doc.rect(10, 40, 190, 30);
    doc.setFontSize(10);
    doc.text(prescriptionForm.careToBeTaken || "N/A", 12, 45, {
      maxWidth: 186,
    });

    doc.setFontSize(11);
    doc.text("Medicine", 10, 80);

    doc.rect(10, 85, 190, 30);
    doc.setFontSize(10);
    doc.text(prescriptionForm.medicines || "None", 12, 90, { maxWidth: 186 });

    doc.setFillColor(0, 0, 128);
    doc.rect(10, 120, 190, 3, "F");

    doc.setFontSize(10);
    doc.text(`Dr. ${doctorName}`, 150, 140);

    doc.save(`prescription-${patientName}.pdf`);
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <div className="prescription-container">
      <div className="prescription-header">
        <button
          className="btn-back"
          onClick={() => navigate("/doctor/profile")}
        >
          Back to Profile
        </button>
        <h2>Consultations & Prescriptions</h2>
        <button className="btn-logout" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="prescription-layout">
        <div className="left-panel">
          <h3>Patient Consultations</h3>
          {consultations.length === 0 ? (
            <p>No consultations yet</p>
          ) : (
            consultations.map((c) => (
              <div
                key={c._id}
                className={`consult-card ${selected?._id === c._id ? "selected" : ""}`}
                onClick={() => handleSelectConsultation(c)}
              >
                <p className="patient-name">{c.patientId?.name}</p>
                <p className="illness-text">{c.currentIllness}</p>
                <span
                  className={`status-badge ${c.status === "completed" ? "status-completed" : "status-pending"}`}
                >
                  {c.status}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="right-panel">
          {!selected ? (
            <p className="select-msg">
              Select a consultation to write prescription
            </p>
          ) : (
            <div>
              <h3>Patient Details</h3>
              <p>
                <strong>Name:</strong> {selected.patientId?.name}
              </p>
              <p>
                <strong>Age:</strong> {selected.patientId?.age}
              </p>
              <p>
                <strong>Illness:</strong> {selected.currentIllness}
              </p>
              <p>
                <strong>Surgery:</strong> {selected.recentSurgery || "None"}
              </p>
              <p>
                <strong>Diabetic:</strong> {selected.isDiabetic ? "Yes" : "No"}
              </p>
              <p>
                <strong>Allergies:</strong> {selected.allergies || "None"}
              </p>

              <hr className="divider" />

              <h3>Write Prescription</h3>

              {error && <p className="form-error">{error}</p>}
              {success && <p className="form-success">{success}</p>}

              <label className="field-label">Care to be taken *</label>
              <textarea
                value={prescriptionForm.careToBeTaken}
                onChange={(e) => {
                  setError("");
                  setPrescriptionForm({
                    ...prescriptionForm,
                    careToBeTaken: e.target.value,
                  });
                }}
                placeholder="Enter care instructions"
              />

              <label className="field-label">Medicines</label>
              <textarea
                value={prescriptionForm.medicines}
                onChange={(e) => {
                  setError("");
                  setPrescriptionForm({
                    ...prescriptionForm,
                    medicines: e.target.value,
                  });
                }}
                placeholder="Enter medicines"
              />

              <div className="btn-group">
                <button
                  className="btn-save"
                  onClick={handleSavePrescription}
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : existingPrescription
                      ? "Update"
                      : "Save"}
                </button>

                {existingPrescription && (
                  <>
                    <button className="btn-pdf" onClick={handleGeneratePDF}>
                      Download PDF
                    </button>
                    <button className="btn-send" onClick={handleSendToPatient}>
                      Send to Patient
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PrescriptionPage;
