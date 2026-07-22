import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { API_URL } from "../api/axios.js";
import Loader from "../components/Loader.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";

export default function Login() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [redirecting, setRedirecting] = useState(false);

  const authError = searchParams.get("error");

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  const handleGoogleLogin = () => {
    setRedirecting(true);
    // Full page redirect kicks off the Passport Google OAuth flow
    window.location.href = `${API_URL}/api/auth/google`;
  };

  if (loading) {
    return <Loader label="Loading..." />;
  }

 return (
    <div className="page-center">
      <ThemeToggle />
      <div className="card">
        <h1>Welcome</h1>
        <p className="subtitle">Sign in to access your dashboard</p>

        {authError && (
          <div className="error-banner">
            {authError === "auth_failed"
              ? "Google sign-in failed or was cancelled. Please try again."
              : "Something went wrong. Please try again."}
          </div>
        )}

        <button
          className="google-btn"
          onClick={handleGoogleLogin}
          disabled={redirecting}
        >
          {redirecting ? (
            <Loader label="Redirecting to Google..." />
          ) : (
            <>
              <GoogleIcon />
              <span>Continue with Google</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.1 29.6 4 24 4c-7.7 0-14.4 4.4-17.7 10.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.5 0 10.4-1.9 14.3-5.1l-6.6-5.5C29.6 35 26.9 36 24 36c-5.3 0-9.7-3.1-11.3-7.9l-6.6 5.1C9.6 39.6 16.3 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.6 5.5C40.5 36.4 44 30.9 44 24c0-1.3-.1-2.7-.4-3.5z"
      />
    </svg>
  );
}