
import axios from "axios";

const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "https://kathabook-2.onrender.com";

const api = axios.create({
    baseURL: `${API_BASE_URL}/api/`,
});

// ===============================
// REQUEST INTERCEPTOR
// ===============================
api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem(
            "kathabook_access_token"
        );

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


// ===============================
// RESPONSE INTERCEPTOR
// ===============================
api.interceptors.response.use(
    (response) => {
        return response;
    },

    async (error) => {
        const originalRequest = error.config;

        // If server returns 401, try refreshing the access token
        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem(
                "kathabook_refresh_token"
            );

            // No refresh token = user really needs to login
            if (!refreshToken) {
                clearAuthAndRedirect();
                return Promise.reject(error);
            }

            try {
                const response = await axios.post(
                    `${API_BASE_URL}/api/auth/token/refresh/`,
                    {
                        refresh: refreshToken,
                    }
                );

                const newAccessToken =
                    response.data.access;

                // Save new access token
                localStorage.setItem(
                    "kathabook_access_token",
                    newAccessToken
                );

                // Update failed request
                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;

                // Try request again
                return api(originalRequest);

            } catch (refreshError) {
                console.log(
                    "Refresh token failed:",
                    refreshError.response?.data
                );

                clearAuthAndRedirect();

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);


// ===============================
// CLEAR AUTH
// ===============================
function clearAuthAndRedirect() {
    localStorage.removeItem("kathabook_user");
    localStorage.removeItem("kathabook_access_token");
    localStorage.removeItem("kathabook_refresh_token");

    window.location.href = "/login";
}


// ===============================
// AUTH APIs
// ===============================

export const loginUser = (data) =>
    api.post("auth/login/", data);

export const registerUser = (data) =>
    api.post("auth/register/", data);

export const forgotPassword = (data) =>
    api.post("auth/forgot-password/", data);

export const resetPassword = (data) =>
    api.post("auth/reset-password/", data);


export default api;

