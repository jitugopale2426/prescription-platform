import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import "../../components/styles/myPrescriptions.css";
import { getErrorMessage } from "../../utils/errorHandler.js";
import jsPDF from "jspdf";

function MyPrescriptions() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrescriptions();

    const interval = setInterval(() => {
      fetchPrescriptions();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const res = await api.get("/prescription/patient");
      setPrescriptions(res.data);
    } catch (err) {
      console.log(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (prescription) => {
    const doc = new jsPDF();

    const doctorName = prescription.doctorId?.name || "Doctor";
    const date = new Date(prescription.createdAt).toLocaleDateString();

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
    doc.text(prescription.careToBeTaken || "N/A", 12, 45, { maxWidth: 186 });

    doc.setFontSize(11);
    doc.text("Medicine", 10, 80);

    doc.rect(10, 85, 190, 30);
    doc.setFontSize(10);
    doc.text(prescription.medicines || "None", 12, 90, { maxWidth: 186 });

    doc.setFillColor(0, 0, 128);
    doc.rect(10, 120, 190, 3, "F");

    doc.setFontSize(10);
    doc.text(`Dr. ${doctorName}`, 150, 140);

    doc.save(`prescription-${doctorName}.pdf`);
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <div className="prescriptions-container">
      <div className="prescriptions-header">
        <button
          className="btn-back"
          onClick={() => navigate("/patient/doctors")}
        >
          Back
        </button>

        <h2>My Prescriptions</h2>

        <button className="btn-logout" onClick={logout}>
          Logout
        </button>
      </div>

      {prescriptions.length === 0 ? (
        <div className="empty-state">
          <p>No prescriptions received yet</p>
        </div>
      ) : (
        <div className="prescriptions-list">
          {prescriptions.map((p) => (
            <div key={p._id} className="prescription-card">
              <div className="card-header">
                <div>
                  <h3 className="doctor-name">Dr. {p.doctorId?.name}</h3>
                  <p className="specialty">{p.doctorId?.specialty}</p>
                </div>
                <p className="date">
                  {new Date(p.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="card-body">
                <div className="section">
                  <p className="section-label">Care to be taken:</p>
                  <p className="section-value">{p.careToBeTaken}</p>
                </div>

                <div className="section">
                  <p className="section-label">Medicines:</p>
                  <p className="section-value">
                    {p.medicines || "No medicines prescribed"}
                  </p>
                </div>
              </div>

              <button
                className="btn-download"
                onClick={() => handleDownload(p)}
              >
                Download
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyPrescriptions;
