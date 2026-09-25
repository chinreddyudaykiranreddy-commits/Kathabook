
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {

    const user = localStorage.getItem("kathabook_user");
    const accessToken = localStorage.getItem(
        "kathabook_access_token"
    );
    const refreshToken = localStorage.getItem(
        "kathabook_refresh_token"
    );

    // User is not logged in
    if (!user || !accessToken || !refreshToken) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;
