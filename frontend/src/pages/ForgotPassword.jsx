
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "../api";
import "./ForgotPassword.css";

function ForgotPassword() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (!email.trim()) {
            setError("Please enter your email address.");
            return;
        }

        try {
            setLoading(true);

            const response = await forgotPassword({
                email: email.trim()
            });

            setMessage(response.data.message);

            // Store token only in browser memory
            setToken(response.data.token);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to verify email."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = () => {
        navigate(`/reset-password/${token}`);
    };

    return (
        <div className="forgot-page">

            <div className="forgot-card">

                <div className="forgot-logo">
                    🔐
                </div>

                <h1>Forgot Password?</h1>

                <p className="forgot-description">
                    Enter your registered email address to reset
                    your Kathabook password.
                </p>

                {message && (
                    <div className="success-message">
                        ✓ {message}
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        ✕ {error}
                    </div>
                )}

                {!token ? (
                    <form onSubmit={handleSubmit}>

                        <label>Email Address</label>

                        <input
                            type="email"
                            placeholder="Enter your registered email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                        />

                        <button
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Checking..."
                                : "Continue"}
                        </button>

                    </form>
                ) : (
                    <div className="reset-section">

                        <p className="reset-info">
                            Your email has been verified.
                            You can now create a new password.
                        </p>

                        <button
                            type="button"
                            onClick={handleResetPassword}
                        >
                            🔑 Reset Password
                        </button>

                    </div>
                )}

                <div className="back-login">
                    <Link to="/login">
                        ← Back to Login
                    </Link>
                </div>

            </div>

        </div>
    );
}

export default ForgotPassword;
