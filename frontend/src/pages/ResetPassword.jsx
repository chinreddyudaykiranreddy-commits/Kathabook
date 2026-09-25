
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../api";
import "./ResetPassword.css";

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (!password || !confirmPassword) {
            setError("Please fill in both password fields.");
            return;
        }

        if (password.length < 6) {
            setError(
                "Password must contain at least 6 characters."
            );
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            const response = await resetPassword({
                token,
                password
            });

            setMessage(response.data.message);

            // Remove any old login session
            localStorage.removeItem("kathabook_user");
            localStorage.removeItem("kathabook_access_token");
            localStorage.removeItem("kathabook_refresh_token");

            setTimeout(() => {
                navigate("/login", { replace: true });
            }, 2000);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to reset password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-page">

            <div className="reset-card">

                <div className="reset-logo">
                    🔐
                </div>

                <h1>Reset Password</h1>

                <p className="reset-description">
                    Create a new password for your Kathabook account.
                </p>

                {message && (
                    <div className="success-message">
                        ✓ {message}
                        <br />
                        Redirecting to Login...
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        ✕ {error}
                    </div>
                )}

                {!message && (
                    <form onSubmit={handleSubmit}>

                        <label>New Password</label>

                        <div className="password-wrapper">

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </button>

                        </div>

                        <label>Confirm Password</label>

                        <div className="password-wrapper">

                            <input
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        !showConfirmPassword
                                    )
                                }
                            >
                                {showConfirmPassword
                                    ? "🙈"
                                    : "👁️"}
                            </button>

                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Changing Password..."
                                : "Reset Password"}
                        </button>

                    </form>
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

export default ResetPassword;

