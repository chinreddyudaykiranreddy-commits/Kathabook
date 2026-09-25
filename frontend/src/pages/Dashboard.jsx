import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./Dashboard.css";

function Dashboard() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    const [customers, setCustomers] = useState([]);
    const [loans, setLoans] = useState([]);
    const [payments, setPayments] = useState([]);

    const [loading, setLoading] = useState(true);

    // Get logged-in user
    useEffect(() => {
        const savedUser = localStorage.getItem("kathabook_user");

        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    // Fetch dashboard data
    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            const [
                customersResponse,
                loansResponse,
                paymentsResponse,
            ] = await Promise.all([
                api.get("customers/"),
                api.get("loans/"),
                api.get("payments/"),
            ]);

            setCustomers(customersResponse.data);
            setLoans(loansResponse.data);
            setPayments(paymentsResponse.data);
        } catch (error) {
            console.error(
                "Error loading dashboard:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Total loan amount
    const totalMoneyLent = loans.reduce(
        (total, loan) =>
            total + Number(loan.loan_amount || 0),
        0
    );

    // Total payments received
    const totalMoneyReceived = payments.reduce(
        (total, payment) =>
            total + Number(payment.amount || 0),
        0
    );

    // Total pending amount
    const totalPending = loans.reduce(
        (total, loan) =>
            total + Number(loan.pending_balance || 0),
        0
    );

    return (
        <div className="dashboard-page">

            {/* Header */}

            <div className="dashboard-header">

                <div>
                    <h1>
                        Welcome, {user?.name || "User"} 👋
                    </h1>

                    <p>
                        Manage your loans and customer repayments
                    </p>
                </div>

            </div>


            {/* Loading */}

            {loading ? (

                <div className="dashboard-loading">
                    Loading dashboard...
                </div>

            ) : (

                <>

                    {/* Statistics */}

                    <div className="dashboard-stats">

                        {/* Customers */}

                        <div className="stat-card">

                            <div className="stat-icon">
                                👥
                            </div>

                            <div>
                                <p>Total Customers</p>

                                <h2>
                                    {customers.length}
                                </h2>
                            </div>

                        </div>


                        {/* Loans */}

                        <div className="stat-card">

                            <div className="stat-icon">
                                💰
                            </div>

                            <div>
                                <p>Total Loans</p>

                                <h2>
                                    {loans.length}
                                </h2>
                            </div>

                        </div>


                        {/* Money Lent */}

                        <div className="stat-card">

                            <div className="stat-icon">
                                📤
                            </div>

                            <div>
                                <p>Money Lent</p>

                                <h2>
                                    ₹
                                    {totalMoneyLent.toLocaleString(
                                        "en-IN"
                                    )}
                                </h2>
                            </div>

                        </div>


                        {/* Money Received */}

                        <div className="stat-card">

                            <div className="stat-icon">
                                📥
                            </div>

                            <div>
                                <p>Money Received</p>

                                <h2>
                                    ₹
                                    {totalMoneyReceived.toLocaleString(
                                        "en-IN"
                                    )}
                                </h2>
                            </div>

                        </div>


                        {/* Pending */}

                        <div className="stat-card pending-card">

                            <div className="stat-icon">
                                ⏳
                            </div>

                            <div>
                                <p>Pending Amount</p>

                                <h2>
                                    ₹
                                    {totalPending.toLocaleString(
                                        "en-IN"
                                    )}
                                </h2>
                            </div>

                        </div>

                    </div>


                    {/* Quick Actions */}

                    <div className="dashboard-section">

                        <h2>
                            Quick Actions
                        </h2>

                        <div className="quick-actions">

                            <button
                                onClick={() =>
                                    navigate("/customers?mode=add")
                                }
                            >
                                👤 Add Customer
                            </button>

                            <button
                                onClick={() =>
                                    navigate("/loans")
                                }
                            >
                                💰 Add Loan
                            </button>

                            <button
                                onClick={() =>
                                    navigate("/payments")
                                }
                            >
                                💳 Add Payment
                            </button>

                        </div>

                    </div>


                    {/* Recent Payments */}

                    <div className="dashboard-section">

                        <div className="section-header">

                            <h2>
                                Recent Payments
                            </h2>

                            <button
                                onClick={() =>
                                    navigate("/payments")
                                }
                            >
                                View All
                            </button>

                        </div>


                        {payments.length === 0 ? (

                            <p className="no-data">
                                No payments yet.
                            </p>

                        ) : (

                            <div className="recent-table">

                                <table>

                                    <thead>

                                        <tr>

                                            <th>
                                                Loan
                                            </th>

                                            <th>
                                                Amount
                                            </th>

                                            <th>
                                                Date
                                            </th>

                                            <th>
                                                Notes
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {payments
                                            .slice(0, 5)
                                            .map((payment) => (

                                                <tr
                                                    key={payment.id}
                                                >

                                                    <td>
                                                        Loan #
                                                        {payment.loan}
                                                    </td>

                                                    <td>
                                                        ₹
                                                        {Number(
                                                            payment.amount
                                                        ).toLocaleString(
                                                            "en-IN"
                                                        )}
                                                    </td>

                                                    <td>
                                                        {
                                                            payment.payment_date
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            payment.notes ||
                                                            "-"
                                                        }
                                                    </td>

                                                </tr>

                                            ))}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>

                </>

            )}

        </div>
    );
}

export default Dashboard;