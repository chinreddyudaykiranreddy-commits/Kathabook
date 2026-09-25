
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Loans from "./pages/Loans";
import Payments from "./pages/Payments";

import ProtectedRoute from "./components/ProtectedRoute";
import HomeRedirect from "./components/HomeRedirect";
import Layout from "./components/Layout";

function App() {
    return (
        <BrowserRouter>

            <Routes>

                {/* Public pages */}
                <Route
                    path="/"
                    element={<HomeRedirect />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />

                <Route
                    path="/reset-password/:token"
                    element={<ResetPassword />}
                />

                {/* Protected pages */}
                <Route
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                >

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/customers"
                        element={<Customers />}
                    />

                    <Route
                        path="/loans"
                        element={<Loans />}
                    />

                    <Route
                        path="/payments"
                        element={<Payments />}
                    />

                </Route>

                <Route
                    path="*"
                    element={<HomeRedirect />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;
