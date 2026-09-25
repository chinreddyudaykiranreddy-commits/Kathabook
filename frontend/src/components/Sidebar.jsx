import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

import Toast from "./Toast";
import ConfirmModal from "./ConfirmModal";

import "./Sidebar.css";


function Sidebar() {

    const navigate = useNavigate();

    const [showLogoutModal, setShowLogoutModal] =
        useState(false);

    const [showToast, setShowToast] =
        useState(false);


    // =====================================================
    // OPEN LOGOUT CONFIRMATION
    // =====================================================

    const handleLogoutClick = () => {

        setShowLogoutModal(true);
    };


    // =====================================================
    // CANCEL LOGOUT
    // =====================================================

    const handleCancelLogout = () => {

        setShowLogoutModal(false);
    };


    // =====================================================
    // CONFIRM LOGOUT
    // =====================================================

    const handleConfirmLogout = () => {

        // Remove logged-in user
        localStorage.removeItem(
            "kathabook_user"
        );


        // Remove access token
        localStorage.removeItem(
            "kathabook_access_token"
        );


        // Remove refresh token
        localStorage.removeItem(
            "kathabook_refresh_token"
        );


        // Close confirmation popup
        setShowLogoutModal(false);


        // Show success message
        setShowToast(true);


        // Go to login page
        // replace prevents going back to dashboard
        setTimeout(() => {

            navigate(
                "/login",
                {
                    replace: true
                }
            );

        }, 800);
    };


    return (

        <>

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside className="sidebar">


                {/* =================================================
                    LOGO
                ================================================= */}

                <div className="sidebar-logo">

                    <div className="logo-icon">
                        K
                    </div>


                    <div>

                        <h2>
                            Kathabook
                        </h2>

                        <span>
                            Loan Manager
                        </span>

                    </div>

                </div>


                {/* =================================================
                    NAVIGATION
                ================================================= */}

                <nav className="sidebar-nav">


                    {/* Dashboard */}

                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            isActive
                                ? "nav-item active"
                                : "nav-item"
                        }
                    >

                        <span>
                            🏠
                        </span>

                        Dashboard

                    </NavLink>


                    {/* Customers */}

                    <NavLink
                        to="/customers"
                        className={({ isActive }) =>
                            isActive
                                ? "nav-item active"
                                : "nav-item"
                        }
                    >

                        <span>
                            👥
                        </span>

                        Customers

                    </NavLink>


                    {/* Loans */}

                    <NavLink
                        to="/loans"
                        className={({ isActive }) =>
                            isActive
                                ? "nav-item active"
                                : "nav-item"
                        }
                    >

                        <span>
                            💰
                        </span>

                        Loans

                    </NavLink>


                    {/* Payments */}

                    <NavLink
                        to="/payments"
                        className={({ isActive }) =>
                            isActive
                                ? "nav-item active"
                                : "nav-item"
                        }
                    >

                        <span>
                            💳
                        </span>

                        Payments

                    </NavLink>

                </nav>


                {/* =================================================
                    LOGOUT
                ================================================= */}

                <div className="sidebar-bottom">

                    <button
                        type="button"
                        className="logout-nav-button"
                        onClick={handleLogoutClick}
                    >

                        <span>
                            🚪
                        </span>

                        Logout

                    </button>

                </div>

            </aside>


            {/* =================================================
                LOGOUT CONFIRMATION MODAL
            ================================================= */}

            {showLogoutModal && (

                <ConfirmModal

                    title="Logout?"

                    message="Are you sure you want to logout from Kathabook?"

                    onConfirm={
                        handleConfirmLogout
                    }

                    onCancel={
                        handleCancelLogout
                    }

                />

            )}


            {/* =================================================
                LOGOUT SUCCESS TOAST
            ================================================= */}

            {showToast && (

                <Toast

                    message="Logout successful!"

                    type="success"

                    onClose={() =>
                        setShowToast(false)
                    }

                />

            )}

        </>

    );
}


export default Sidebar;