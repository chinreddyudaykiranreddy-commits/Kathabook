
import { useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";

import { loginUser } from "../api";
import Toast from "../components/Toast";

import "./Login.css";


function Login() {

    const navigate = useNavigate();


    // =====================================================
    // STATE
    // =====================================================

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success",
    });


    // =====================================================
    // CHECK EXISTING LOGIN
    // =====================================================

    const existingUser =
        localStorage.getItem("kathabook_user");

    const accessToken =
        localStorage.getItem("kathabook_access_token");

    const refreshToken =
        localStorage.getItem("kathabook_refresh_token");


    if (
        existingUser &&
        accessToken &&
        refreshToken
    ) {

        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );
    }


    // =====================================================
    // TOAST
    // =====================================================

    const showToast = (message, type) => {

        setToast({
            show: true,
            message,
            type,
        });


        setTimeout(() => {

            setToast({
                show: false,
                message: "",
                type: "success",
            });

        }, 3000);
    };


    // =====================================================
    // LOGIN
    // =====================================================

    const handleLogin = async (event) => {

        event.preventDefault();


        // -------------------------------------------------
        // VALIDATION
        // -------------------------------------------------

        if (!email.trim()) {

            showToast(
                "Please enter your email.",
                "error"
            );

            return;
        }


        if (!password) {

            showToast(
                "Please enter your password.",
                "error"
            );

            return;
        }


        try {

            setLoading(true);


            // -------------------------------------------------
            // API LOGIN
            // -------------------------------------------------

            const response = await loginUser({

                email: email.trim(),

                password: password,

            });


            // -------------------------------------------------
            // GET RESPONSE DATA
            // -------------------------------------------------

            const user = response.data.user;

            const accessToken =
                response.data.tokens?.access;

            const refreshToken =
                response.data.tokens?.refresh;


            // -------------------------------------------------
            // CHECK TOKEN RESPONSE
            // -------------------------------------------------

            if (
                !user ||
                !accessToken ||
                !refreshToken
            ) {

                showToast(
                    "Login response is incomplete. Please try again.",
                    "error"
                );

                return;
            }


            // -------------------------------------------------
            // SAVE USER
            // -------------------------------------------------

            localStorage.setItem(
                "kathabook_user",
                JSON.stringify(user)
            );


            // -------------------------------------------------
            // SAVE ACCESS TOKEN
            // -------------------------------------------------

            localStorage.setItem(
                "kathabook_access_token",
                accessToken
            );


            // -------------------------------------------------
            // SAVE REFRESH TOKEN
            // -------------------------------------------------

            localStorage.setItem(
                "kathabook_refresh_token",
                refreshToken
            );


            // -------------------------------------------------
            // SUCCESS
            // -------------------------------------------------

            showToast(
                "Login successful!",
                "success"
            );


            // -------------------------------------------------
            // GO TO DASHBOARD
            // -------------------------------------------------

            setTimeout(() => {

                navigate(
                    "/dashboard",
                    {
                        replace: true
                    }
                );

            }, 1000);


        } catch (error) {

            console.error(
                "Login error:",
                error
            );


            const message =
                error.response?.data?.message ||
                "Login failed. Please check your email and password.";


            showToast(
                message,
                "error"
            );


        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="login-page">

            <div className="login-card">


                {/* =========================================
                    LOGO
                ========================================== */}

                <div className="login-logo">

                    <div className="login-logo-icon">
                        K
                    </div>

                    <h1>
                        Kathabook
                    </h1>

                    <p>
                        Loan Management System
                    </p>

                </div>


                {/* =========================================
                    HEADING
                ========================================== */}

                <div className="login-heading">

                    <h2>
                        Welcome Back
                    </h2>

                    <p>
                        Login to manage your loans
                        and customers
                    </p>

                </div>


                {/* =========================================
                    LOGIN FORM
                ========================================== */}

                <form onSubmit={handleLogin}>


                    {/* EMAIL */}

                    <div className="form-group">

                        <label>
                            Email Address
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(event) =>
                                setEmail(
                                    event.target.value
                                )
                            }
                            autoComplete="email"
                        />

                    </div>


                    {/* PASSWORD */}

                    <div className="form-group">

                        <label>
                            Password
                        </label>


                        <div className="password-wrapper">

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Enter your password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(
                                        event.target.value
                                    )
                                }
                                autoComplete="current-password"
                            />


                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >

                                {showPassword
                                    ? "🙈"
                                    : "👁️"}

                            </button>

                        </div>

                    </div>


                    {/* FORGOT PASSWORD */}

                    <div className="forgot-password-link">

                        <Link to="/forgot-password">
                            Forgot Password?
                        </Link>

                    </div>


                    {/* LOGIN BUTTON */}

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Logging in..."
                            : "Login"}

                    </button>

                </form>


                {/* =========================================
                    REGISTER
                ========================================== */}

                <div className="register-link">

                    <span>
                        Don't have an account?
                    </span>


                    <button
                        type="button"
                        onClick={() =>
                            navigate("/register")
                        }
                    >
                        Create Account
                    </button>

                </div>

            </div>


            {/* =============================================
                TOAST
            ============================================== */}

            {toast.show && (

                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() =>
                        setToast({
                            show: false,
                            message: "",
                            type: "success",
                        })
                    }
                />

            )}

        </div>
    );
}


export default Login;
