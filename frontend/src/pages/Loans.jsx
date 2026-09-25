
import { useEffect, useState } from "react";
import api from "../api";
import "./Loans.css";

function Loans() {
    const [loans, setLoans] = useState([]);
    const [customers, setCustomers] = useState([]);

    const [formData, setFormData] = useState({
        customer: "",
        loan_amount: "",
        interest_rate: "",
        duration_months: "",
        start_date: "",
        due_date: "",
    });

    const [loading, setLoading] = useState(false);
    const [loadingCustomers, setLoadingCustomers] = useState(true);

    // Get customers
    const fetchCustomers = async () => {
        try {
            setLoadingCustomers(true);

            const response = await api.get("customers/");

            setCustomers(response.data);
        } catch (error) {
            console.error(
                "Error fetching customers:",
                error
            );
        } finally {
            setLoadingCustomers(false);
        }
    };

    // Get loans
    const fetchLoans = async () => {
        try {
            const response = await api.get("loans/");

            setLoans(response.data);
        } catch (error) {
            console.error(
                "Error fetching loans:",
                error
            );
        }
    };

    useEffect(() => {
        fetchCustomers();
        fetchLoans();
    }, []);

    // Get customer name
    const getCustomerName = (customerId) => {
        const customer = customers.find(
            (customer) => customer.id === customerId
        );

        return customer
            ? customer.name
            : "Unknown Customer";
    };

    // Input change
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
    };

    // Add loan
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!formData.customer) {
            alert("Please select a customer");
            return;
        }

        if (
            !formData.loan_amount ||
            Number(formData.loan_amount) <= 0
        ) {
            alert("Please enter a valid loan amount");
            return;
        }

        if (!formData.duration_months) {
            alert("Please enter loan duration");
            return;
        }

        if (!formData.start_date) {
            alert("Please select start date");
            return;
        }

        if (!formData.due_date) {
            alert("Please select due date");
            return;
        }

        try {
            setLoading(true);

            await api.post("loans/", {
                customer: Number(formData.customer),
                loan_amount: formData.loan_amount,
                interest_rate:
                    formData.interest_rate || 0,
                duration_months:
                    Number(formData.duration_months),
                start_date: formData.start_date,
                due_date: formData.due_date,
            });

            alert("Loan added successfully!");

            setFormData({
                customer: "",
                loan_amount: "",
                interest_rate: "",
                duration_months: "",
                start_date: "",
                due_date: "",
            });

            await fetchLoans();

        } catch (error) {
            console.error(
                "Error adding loan:",
                error
            );

            alert(
                error.response?.data?.detail ||
                error.response?.data?.message ||
                "Failed to add loan"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="loans-page">

            {/* Header */}

            <div className="loans-header">

                <div>
                    <h1>Loans</h1>

                    <p>
                        Manage customer loans and
                        repayment balances
                    </p>
                </div>

            </div>


            {/* Add Loan Form */}

            <div className="loan-form-card">

                <h2>Add New Loan</h2>

                <form onSubmit={handleSubmit}>

                    {/* Customer */}

                    <div className="form-group">

                        <label>
                            Customer
                        </label>

                        <select
                            name="customer"
                            value={formData.customer}
                            onChange={handleChange}
                            disabled={loadingCustomers}
                        >

                            <option value="">
                                {loadingCustomers
                                    ? "Loading customers..."
                                    : "Select Customer"}
                            </option>

                            {customers.map(
                                (customer) => (
                                    <option
                                        key={
                                            customer.id
                                        }
                                        value={
                                            customer.id
                                        }
                                    >
                                        {customer.name} -{" "}
                                        {customer.phone}
                                    </option>
                                )
                            )}

                        </select>

                    </div>


                    {/* Amount + Interest */}

                    <div className="form-row">

                        <div className="form-group">

                            <label>
                                Loan Amount
                            </label>

                            <input
                                type="number"
                                name="loan_amount"
                                value={
                                    formData.loan_amount
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter loan amount"
                                min="1"
                                step="0.01"
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Interest Rate (%)
                            </label>

                            <input
                                type="number"
                                name="interest_rate"
                                value={
                                    formData.interest_rate
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Example: 10"
                                min="0"
                                step="0.01"
                            />

                        </div>

                    </div>


                    {/* Duration */}

                    <div className="form-group">

                        <label>
                            Duration (Months)
                        </label>

                        <input
                            type="number"
                            name="duration_months"
                            value={
                                formData.duration_months
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Example: 12"
                            min="1"
                        />

                    </div>


                    {/* Dates */}

                    <div className="form-row">

                        <div className="form-group">

                            <label>
                                Start Date
                            </label>

                            <input
                                type="date"
                                name="start_date"
                                value={
                                    formData.start_date
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Due Date
                            </label>

                            <input
                                type="date"
                                name="due_date"
                                value={
                                    formData.due_date
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>

                    </div>


                    <button
                        type="submit"
                        className="create-loan-btn"
                        disabled={loading}
                    >
                        {loading
                            ? "Saving..."
                            : "Add Loan"}
                    </button>

                </form>

            </div>


            {/* Loan List */}

            <div className="loans-table-card">

                <h2>Loan Records</h2>

                {loans.length === 0 ? (

                    <p className="no-data">
                        No loans found.
                    </p>

                ) : (

                    <div className="table-container">

                        <table>

                            <thead>

                                <tr>
                                    <th>ID</th>
                                    <th>Customer</th>
                                    <th>Loan Amount</th>
                                    <th>Interest</th>
                                    <th>Total Payable</th>
                                    <th>Total Paid</th>
                                    <th>Pending</th>
                                    <th>Duration</th>
                                    <th>Due Date</th>
                                </tr>

                            </thead>


                            <tbody>

                                {loans.map(
                                    (loan) => (

                                        <tr
                                            key={
                                                loan.id
                                            }
                                        >

                                            <td>
                                                #
                                                {
                                                    loan.id
                                                }
                                            </td>

                                            <td>
                                                <strong>
                                                    {
                                                        getCustomerName(
                                                            loan.customer
                                                        )
                                                    }
                                                </strong>
                                            </td>

                                            <td>
                                                ₹
                                                {
                                                    loan.loan_amount
                                                }
                                            </td>

                                            <td>
                                                {
                                                    loan.interest_rate
                                                }
                                                %
                                            </td>

                                            <td>
                                                ₹
                                                {
                                                    loan.total_payable
                                                }
                                            </td>

                                            <td className="paid-amount">
                                                ₹
                                                {
                                                    loan.total_paid
                                                }
                                            </td>

                                            <td className="pending-amount">
                                                ₹
                                                {
                                                    loan.pending_balance
                                                }
                                            </td>

                                            <td>
                                                {
                                                    loan.duration_months
                                                }{" "}
                                                months
                                            </td>

                                            <td>
                                                {
                                                    loan.due_date
                                                }
                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}

export default Loans;
