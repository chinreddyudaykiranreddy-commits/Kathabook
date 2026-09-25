
import { useEffect, useState } from "react";
import api from "../api";
import "./Payments.css";

function Payments() {
    const [loans, setLoans] = useState([]);
    const [payments, setPayments] = useState([]);
    const [customers, setCustomers] = useState([]);

    const [formData, setFormData] = useState({
        loan: "",
        amount: "",
        payment_date: new Date().toISOString().split("T")[0],
        notes: "",
    });

    const [loading, setLoading] = useState(false);

    // Get loans
    const fetchLoans = async () => {
        try {
            const response = await api.get("loans/");
            setLoans(response.data);
        } catch (error) {
            console.error("Error fetching loans:", error);
        }
    };

    // Get payments
    const fetchPayments = async () => {
        try {
            const response = await api.get("payments/");
            setPayments(response.data);
        } catch (error) {
            console.error("Error fetching payments:", error);
        }
    };

    // Get customers
    const fetchCustomers = async () => {
        try {
            const response = await api.get("customers/");
            setCustomers(response.data);
        } catch (error) {
            console.error("Error fetching customers:", error);
        }
    };

    // Load all data
    useEffect(() => {
        fetchLoans();
        fetchPayments();
        fetchCustomers();
    }, []);

    // Get customer name
    const getCustomerName = (customerId) => {
        const customer = customers.find(
            (customer) => customer.id === customerId
        );

        return customer ? customer.name : "Unknown Customer";
    };

    // Input change
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
    };

    // Add payment
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!formData.loan) {
            alert("Please select a loan");
            return;
        }

        if (!formData.amount || Number(formData.amount) <= 0) {
            alert("Please enter a valid payment amount");
            return;
        }

        // Check selected loan
        const selectedLoan = loans.find(
            (loan) => loan.id === Number(formData.loan)
        );

        if (!selectedLoan) {
            alert("Selected loan not found");
            return;
        }

        // Prevent overpayment
        if (
            Number(formData.amount) >
            Number(selectedLoan.pending_balance)
        ) {
            alert(
                `Payment cannot be greater than the pending balance of ₹${selectedLoan.pending_balance}`
            );
            return;
        }

        try {
            setLoading(true);

            await api.post("payments/", {
                loan: Number(formData.loan),
                amount: formData.amount,
                payment_date: formData.payment_date,
                notes: formData.notes,
            });

            alert("Payment added successfully!");

            // Reset form
            setFormData({
                loan: "",
                amount: "",
                payment_date: new Date()
                    .toISOString()
                    .split("T")[0],
                notes: "",
            });

            // Refresh data
            await fetchLoans();
            await fetchPayments();

        } catch (error) {
            console.error("Error adding payment:", error);

            alert(
                error.response?.data?.message ||
                error.response?.data?.detail ||
                "Failed to add payment"
            );
        } finally {
            setLoading(false);
        }
    };

    // Selected loan
    const selectedLoan = loans.find(
        (loan) => loan.id === Number(formData.loan)
    );

    return (
        <div className="payments-page">

            {/* Header */}

            <div className="payments-header">
                <div>
                    <h1>Payments</h1>

                    <p>
                        Manage customer loan repayments
                    </p>
                </div>
            </div>


            {/* Add Payment */}

            <div className="payment-form-card">

                <h2>Add Payment</h2>

                <form onSubmit={handleSubmit}>

                    {/* Loan */}

                    <div className="form-group">

                        <label>Select Loan</label>

                        <select
                            name="loan"
                            value={formData.loan}
                            onChange={handleChange}
                        >

                            <option value="">
                                Select Loan
                            </option>

                            {loans.map((loan) => (

                                <option
                                    key={loan.id}
                                    value={loan.id}
                                >
                                    Loan #{loan.id} -{" "}
                                    {getCustomerName(loan.customer)} - ₹
                                    {loan.pending_balance}
                                </option>

                            ))}

                        </select>

                    </div>


                    {/* Selected Loan Information */}

                    {selectedLoan && (

                        <div className="loan-info">

                            <p>
                                <strong>Customer:</strong>{" "}
                                {getCustomerName(
                                    selectedLoan.customer
                                )}
                            </p>

                            <p>
                                <strong>Loan Amount:</strong>{" "}
                                ₹{selectedLoan.loan_amount}
                            </p>

                            <p>
                                <strong>Total Payable:</strong>{" "}
                                ₹{selectedLoan.total_payable}
                            </p>

                            <p>
                                <strong>Total Paid:</strong>{" "}
                                ₹{selectedLoan.total_paid}
                            </p>

                            <p>
                                <strong>Pending Balance:</strong>{" "}
                                ₹{selectedLoan.pending_balance}
                            </p>

                        </div>

                    )}


                    {/* Amount + Date */}

                    <div className="form-row">

                        <div className="form-group">

                            <label>Payment Amount</label>

                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                placeholder="Enter amount"
                                min="1"
                                step="0.01"
                            />

                        </div>


                        <div className="form-group">

                            <label>Payment Date</label>

                            <input
                                type="date"
                                name="payment_date"
                                value={formData.payment_date}
                                onChange={handleChange}
                            />

                        </div>

                    </div>


                    {/* Notes */}

                    <div className="form-group">

                        <label>Notes</label>

                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Example: Monthly repayment"
                            rows="3"
                        />

                    </div>


                    {/* Button */}

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Saving..."
                            : "Add Payment"}
                    </button>

                </form>

            </div>


            {/* Payment History */}

            <div className="payments-table-card">

                <h2>Payment History</h2>

                {payments.length === 0 ? (

                    <p className="no-data">
                        No payments found.
                    </p>

                ) : (

                    <div className="table-container">

                        <table>

                            <thead>

                                <tr>
                                    <th>ID</th>
                                    <th>Loan</th>
                                    <th>Customer</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                    <th>Notes</th>
                                </tr>

                            </thead>


                            <tbody>

                                {payments.map((payment) => (

                                    <tr key={payment.id}>

                                        <td>
                                            {payment.id}
                                        </td>

                                        <td>
                                            Loan #{payment.loan}
                                        </td>

                                        <td>
                                            {payment.customer_name ||
                                                getCustomerName(
                                                    payment.loan
                                                )}
                                        </td>

                                        <td>
                                            ₹{payment.amount}
                                        </td>

                                        <td>
                                            {payment.payment_date}
                                        </td>

                                        <td>
                                            {payment.notes || "-"}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}

export default Payments;
