import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

function formatDate(dateString) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } finally {
      navigate("/login", { replace: true });
    }
  };

  if (!user) return null; // ProtectedRoute already guards this, just a safety net

  return (
    <div className="page-center">
      <div className="card dashboard-card">
        <span className="badge">Logged in with Google</span>

        <img
          src={user.profilePicture}
          alt={`${user.name}'s profile`}
          className="avatar"
          referrerPolicy="no-referrer"
        />

        <h1>{user.name}</h1>
        <p className="subtitle">{user.email}</p>

        <div className="info-list">
          <div className="info-row">
            <span className="info-label">Member since</span>
            <span className="info-value">{formatDate(user.createdAt)}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Last login</span>
            <span className="info-value">{formatDate(user.lastLogin)}</span>
          </div>
        </div>

        <button className="logout-btn" onClick={handleLogout} disabled={loggingOut}>
          {loggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );
}