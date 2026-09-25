
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api";
import "./Customers.css";

function Customers() {
    const location = useLocation();

    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [showForm, setShowForm] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        address: "",
    });


    // ==========================================
    // OPEN ADD CUSTOMER FORM
    // ==========================================
    const openAddForm = () => {
        setEditingCustomer(null);

        setFormData({
            name: "",
            phone: "",
            email: "",
            address: "",
        });

        setShowForm(true);
    };


    // ==========================================
    // OPEN EDIT CUSTOMER FORM
    // ==========================================
    const openEditForm = (customer) => {
        setEditingCustomer(customer);

        setFormData({
            name: customer.name || "",
            phone: customer.phone || "",
            email: customer.email || "",
            address: customer.address || "",
        });

        setShowForm(true);
    };


    // ==========================================
    // FETCH CUSTOMERS
    // ==========================================
    const fetchCustomers = async () => {
        try {
            setLoading(true);

            const response = await api.get("customers/");

            setCustomers(response.data);

        } catch (error) {
            console.error("Error fetching customers:", error);

            console.error(
                "Status:",
                error.response?.status
            );

            console.error(
                "Server response:",
                error.response?.data
            );

            /*
             * IMPORTANT:
             *
             * Do NOT manually remove tokens here.
             *
             * api.js is responsible for refreshing
             * the access token when a 401 happens.
             */

            if (error.response?.status === 401) {
                alert(
                    "Your session has expired. Please login again."
                );
                return;
            }

            alert(
                "Unable to load customers. Please check the backend."
            );

        } finally {
            setLoading(false);
        }
    };


    // ==========================================
    // LOAD CUSTOMERS WHEN PAGE OPENS
    // ==========================================
    useEffect(() => {
        fetchCustomers();
    }, []);


    // ==========================================
    // OPEN ADD FORM FROM URL
    //
    // Example:
    // /customers?mode=add
    // ==========================================
    useEffect(() => {
        const params = new URLSearchParams(
            location.search
        );

        if (params.get("mode") === "add") {
            openAddForm();
        }
    }, [location.search]);


    // ==========================================
    // HANDLE INPUT CHANGE
    // ==========================================
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
    };


    // ==========================================
    // ADD / UPDATE CUSTOMER
    // ==========================================
    const handleSubmit = async (event) => {
        event.preventDefault();

        const name = formData.name.trim();
        const phone = formData.phone.trim();
        const email = formData.email.trim();
        const address = formData.address.trim();


        // ==========================================
        // VALIDATION
        // ==========================================
        if (!name) {
            alert("Please enter customer name.");
            return;
        }

        if (!phone) {
            alert("Please enter phone number.");
            return;
        }


        const customerData = {
            name,
            phone,
            email,
            address,
        };


        try {
            setSaving(true);


            // ==========================================
            // UPDATE CUSTOMER
            // ==========================================
            if (editingCustomer) {

                const response = await api.put(
                    `customers/${editingCustomer.id}/`,
                    customerData
                );

                console.log(
                    "Customer updated:",
                    response.data
                );

                alert(
                    "Customer updated successfully!"
                );

            }

            // ==========================================
            // ADD CUSTOMER
            // ==========================================
            else {

                const response = await api.post(
                    "customers/",
                    customerData
                );

                console.log(
                    "Customer added:",
                    response.data
                );

                alert(
                    "Customer added successfully!"
                );
            }


            // ==========================================
            // CLEAR FORM
            // ==========================================
            setFormData({
                name: "",
                phone: "",
                email: "",
                address: "",
            });

            setEditingCustomer(null);

            setShowForm(false);


            // ==========================================
            // REFRESH CUSTOMER LIST
            // ==========================================
            await fetchCustomers();

        } catch (error) {

            console.error(
                "Error saving customer:",
                error
            );

            console.error(
                "Status:",
                error.response?.status
            );

            console.error(
                "Server response:",
                error.response?.data
            );


            // ==========================================
            // UNAUTHORIZED
            // ==========================================
            if (error.response?.status === 401) {

                alert(
                    "Your session has expired. Please login again."
                );

                return;
            }


            // ==========================================
            // VALIDATION ERROR
            // ==========================================
            if (error.response?.status === 400) {

                console.log(
                    "Validation error:",
                    error.response.data
                );

                alert(
                    "Please check the customer details."
                );

                return;
            }


            // ==========================================
            // PERMISSION ERROR
            // ==========================================
            if (error.response?.status === 403) {

                alert(
                    "You don't have permission to add this customer."
                );

                return;
            }


            // ==========================================
            // SERVER ERROR
            // ==========================================
            if (error.response?.status >= 500) {

                alert(
                    "Server error. Please check Django."
                );

                return;
            }


            // ==========================================
            // CONNECTION ERROR
            // ==========================================
            alert(
                "Unable to save customer. Please make sure the backend is running."
            );

        } finally {
            setSaving(false);
        }
    };


    // ==========================================
    // DELETE CUSTOMER
    // ==========================================
    const handleDelete = async (customer) => {

        const confirmDelete = window.confirm(
            `Are you sure you want to delete ${customer.name}?`
        );

        if (!confirmDelete) {
            return;
        }


        try {

            await api.delete(
                `customers/${customer.id}/`
            );

            alert(
                "Customer deleted successfully!"
            );

            await fetchCustomers();

        } catch (error) {

            console.error(
                "Error deleting customer:",
                error
            );

            alert(
                "Unable to delete customer."
            );
        }
    };


    // ==========================================
    // PAGE
    // ==========================================
    return (
        <div className="customers-page">

            {/* =====================================
                HEADER
            ===================================== */}

            <div className="customers-header">

                <div>

                    <h1>
                        Customers
                    </h1>

                    <p>
                        Manage your customers and
                        their credit records.
                    </p>

                </div>


                <button
                    type="button"
                    className="add-customer-btn"
                    onClick={openAddForm}
                >
                    + Add Customer
                </button>

            </div>


            {/* =====================================
                CUSTOMER LIST
            ===================================== */}

            <div className="customers-card">

                {loading ? (

                    <p>
                        Loading customers...
                    </p>

                ) : customers.length === 0 ? (

                    <div className="empty-customers">

                        <h2>
                            No Customers Yet
                        </h2>

                        <p>
                            Start by adding your
                            first customer.
                        </p>

                        <button
                            type="button"
                            className="add-customer-btn"
                            onClick={openAddForm}
                        >
                            + Add Your First Customer
                        </button>

                    </div>

                ) : (

                    <div className="customer-table-container">

                        <table className="customer-table">

                            <thead>

                                <tr>

                                    <th>
                                        Name
                                    </th>

                                    <th>
                                        Phone
                                    </th>

                                    <th>
                                        Email
                                    </th>

                                    <th>
                                        Address
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {customers.map(
                                    (customer) => (

                                        <tr
                                            key={
                                                customer.id
                                            }
                                        >

                                            <td>
                                                {
                                                    customer.name
                                                }
                                            </td>

                                            <td>
                                                {
                                                    customer.phone
                                                }
                                            </td>

                                            <td>
                                                {
                                                    customer.email ||
                                                    "-"
                                                }
                                            </td>

                                            <td>
                                                {
                                                    customer.address ||
                                                    "-"
                                                }
                                            </td>


                                            <td>

                                                <div className="action-buttons">

                                                    <button
                                                        type="button"
                                                        className="edit-btn"
                                                        onClick={() =>
                                                            openEditForm(
                                                                customer
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>


                                                    <button
                                                        type="button"
                                                        className="delete-btn"
                                                        onClick={() =>
                                                            handleDelete(
                                                                customer
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>


            {/* =====================================
                ADD / EDIT CUSTOMER MODAL
            ===================================== */}

            {showForm && (

                <div className="modal-overlay">

                    <div className="customer-modal">


                        {/* =================================
                            MODAL HEADER
                        ================================= */}

                        <div className="modal-header">

                            <div>

                                <h2>

                                    {editingCustomer
                                        ? "Edit Customer"
                                        : "Add Customer"}

                                </h2>

                                <p>

                                    {editingCustomer
                                        ? "Update customer information"
                                        : "Enter customer information"}

                                </p>

                            </div>


                            <button
                                type="button"
                                className="close-btn"
                                onClick={() =>
                                    setShowForm(false)
                                }
                            >
                                ×
                            </button>

                        </div>


                        {/* =================================
                            FORM
                        ================================= */}

                        <form
                            onSubmit={handleSubmit}
                        >


                            {/* CUSTOMER NAME */}

                            <div className="form-group">

                                <label>
                                    Customer Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter customer name"
                                    value={
                                        formData.name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>


                            {/* PHONE */}

                            <div className="form-group">

                                <label>
                                    Phone Number
                                </label>

                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Enter phone number"
                                    value={
                                        formData.phone
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>


                            {/* EMAIL */}

                            <div className="form-group">

                                <label>
                                    Email
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter email address"
                                    value={
                                        formData.email
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>


                            {/* ADDRESS */}

                            <div className="form-group">

                                <label>
                                    Address
                                </label>

                                <textarea
                                    name="address"
                                    placeholder="Enter customer address"
                                    value={
                                        formData.address
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    rows="3"
                                />

                            </div>


                            {/* =================================
                                BUTTONS
                            ================================= */}

                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() =>
                                        setShowForm(false)
                                    }
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="save-btn"
                                    disabled={saving}
                                >

                                    {saving
                                        ? "Saving..."
                                        : editingCustomer
                                        ? "Update Customer"
                                        : "Add Customer"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Customers;
