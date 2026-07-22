import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";

function formatDate(dateString) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function Dashboard() {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [error, setError] = useState("");

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } finally {
      navigate("/login", { replace: true });
    }
  };

  const startEditing = () => {
    setDisplayName(user.displayName || "");
    setBio(user.bio || "");
    setError("");
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setError("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await updateProfile({ displayName, bio });
      setIsEditing(false);
    } catch (err) {
      setError("Couldn't save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  const nameToShow = user.displayName?.trim() ? user.displayName : user.name;

  return (
    <div className="page-center">
      <ThemeToggle />
      <div className="card dashboard-card">
        <span className="badge">Logged in with Google</span>

        <img
          src={user.profilePicture}
          alt={`${nameToShow}'s profile`}
          className="avatar"
          referrerPolicy="no-referrer"
        />

        {!isEditing ? (
          <>
            <h1>{nameToShow}</h1>
            <p className="subtitle">{user.email}</p>
            {user.bio && <p className="subtitle">{user.bio}</p>}

            <div className="info-section">
              <div className="info-section-title">Account Info</div>
              <div className="info-row">
                <span className="info-label">Member since</span>
                <span className="info-value">{formatDate(user.createdAt)}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Last login</span>
                <span className="info-value">{formatDate(user.lastLogin)}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Google account</span>
                <span className="info-value">{user.name}</span>
              </div>
            </div>

            <div className="action-row">
              <button className="edit-btn" onClick={startEditing}>
                Edit Profile
              </button>
              <button
                className="logout-btn flex-half"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSave}>
            <div className="info-section" style={{ borderTop: "none", paddingTop: 0 }}>
              <div className="info-section-title">Edit Profile</div>

              {error && <div className="error-banner">{error}</div>}

              <div className="form-group">
                <label htmlFor="displayName">Display Name</label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder={user.name}
                  maxLength={50}
                />
              </div>

              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us a bit about yourself"
                  maxLength={160}
                />
              </div>
            </div>

            <button className="save-btn" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              className="cancel-btn"
              type="button"
              onClick={cancelEditing}
              disabled={saving}
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
}