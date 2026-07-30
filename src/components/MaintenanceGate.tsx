import { ReactNode, useEffect, useState } from "react";
import { API_BASE_URL } from "../services/config";
import { isAuthenticated } from "../services/auth";

interface Props {
  children: ReactNode;
}

const MaintenanceGate = ({ children }: Props) => {
  const [checked, setChecked] = useState(false);
  const [maintenance, setMaintenance] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/settings`)
      .then((res) => res.json())
      .then((data) => setMaintenance(Boolean(data?.maintenanceMode)))
      .catch(() => setMaintenance(false))
      .finally(() => setChecked(true));
  }, []);

  // Don't flash content before the check resolves
  if (!checked) return null;

  // Logged-in admins can still view the site during maintenance
  if (maintenance && !isAuthenticated()) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#080C1A",
          color: "#fff",
          padding: "40px 24px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 520 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#C9293A,#E8610A)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
              fontSize: 28,
            }}
          >
            🛠️
          </div>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "2rem", fontWeight: 900, marginBottom: 12 }}>
            We'll Be Right Back
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.7, fontSize: 15 }}>
            Our website is currently undergoing scheduled maintenance. Please check
            back shortly. Thank you for your patience.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default MaintenanceGate;
