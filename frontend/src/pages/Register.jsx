import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "../api";

import "./Register.css";


function Register() {

    const navigate = useNavigate();


    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });


    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // =====================================================
    // HANDLE INPUT CHANGE
    // =====================================================

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value
        });

        setError("");
        setSuccess("");
    };


    // =====================================================
    // REGISTER
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");


        // Check empty fields

        if (
            !formData.name.trim() ||
            !formData.email.trim() ||
            !formData.password ||
            !formData.confirmPassword
        ) {

            setError(
                "Please fill in all fields."
            );

            return;
        }


        // Check password length

        if (formData.password.length < 6) {

            setError(
                "Password must contain at least 6 characters."
            );

            return;
        }


        // Check passwords

        if (
            formData.password !==
            formData.confirmPassword
        ) {

            setError(
                "Passwords do not match."
            );

            return;
        }


        try {

            setLoading(true);


            // IMPORTANT:
            // Do not send confirmPassword
            // to Django.

            const response = await registerUser({
                name: formData.name.trim(),
                email: formData.email.trim(),
                password: formData.password
            });


            setSuccess(
                response.data.message ||
                "Account created successfully!"
            );


            // Clear form

            setFormData({
                name: "",
                email: "",
                password: "",
                confirmPassword: ""
            });


            // Go to Login

            setTimeout(() => {

                navigate(
                    "/login",
                    {
                        replace: true
                    }
                );

            }, 1500);


        } catch (error) {

            if (
                error.response &&
                error.response.data
            ) {

                setError(
                    error.response.data.message ||
                    "Unable to create account."
                );

            } else {

                setError(
                    "Unable to connect to server. Please check Django server."
                );
            }

        } finally {

            setLoading(false);
        }
    };


    return (

        <div className="register-page">

            <div className="register-card">


                {/* =================================================
                    LOGO
                ================================================= */}

                <div className="register-logo">

                    <div className="register-logo-icon">
                        K
                    </div>

                    <div>
                        <h1>
                            Kathabook
                        </h1>

                        <span>
                            Loan Manager
                        </span>
                    </div>

                </div>


                {/* =================================================
                    TITLE
                ================================================= */}

                <div className="register-header">

                    <h2>
                        Create Account
                    </h2>

                    <p>
                        Create your Kathabook account
                    </p>

                </div>


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div className="register-message error">

                        <span>✕</span>

                        {error}

                    </div>

                )}


                {/* =================================================
                    SUCCESS
                ================================================= */}

                {success && (

                    <div className="register-message success">

                        <span>✓</span>

                        {success}

                    </div>

                )}


                {/* =================================================
                    FORM
                ================================================= */}

                <form
                    onSubmit={handleSubmit}
                    className="register-form"
                >


                    {/* NAME */}

                    <div className="register-form-group">

                        <label>
                            Full Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            autoComplete="name"
                        />

                    </div>


                    {/* EMAIL */}

                    <div className="register-form-group">

                        <label>
                            Email Address
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            autoComplete="email"
                        />

                    </div>


                    {/* PASSWORD */}

                    <div className="register-form-group">

                        <label>
                            Password
                        </label>

                        <div className="register-password-wrapper">

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a password"
                                autoComplete="new-password"
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                            >

                                {showPassword
                                    ? "Hide"
                                    : "Show"}

                            </button>

                        </div>

                        <small>
                            Password must contain at least 6 characters.
                        </small>

                    </div>


                    {/* CONFIRM PASSWORD */}

                    <div className="register-form-group">

                        <label>
                            Re-enter Password
                        </label>

                        <div className="register-password-wrapper">

                            <input
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                name="confirmPassword"
                                value={
                                    formData.confirmPassword
                                }
                                onChange={handleChange}
                                placeholder="Re-enter your password"
                                autoComplete="new-password"
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
                                    ? "Hide"
                                    : "Show"}

                            </button>

                        </div>

                    </div>


                    {/* CREATE ACCOUNT */}

                    <button
                        type="submit"
                        className="create-account-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Creating Account..."
                            : "Create Account"}

                    </button>

                </form>


                {/* =================================================
                    LOGIN LINK
                ================================================= */}

                <div className="login-link">

                    <span>
                        Already have an account?
                    </span>

                    <Link to="/login">
                        Login
                    </Link>

                </div>


            </div>

        </div>
    );
}


export default Register;