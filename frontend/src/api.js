import axios from "axios";

const defaultBackendUrl =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
        ? "http://127.0.0.1:8000"
        : "https://kathabook-2.onrender.com";

const API_BASE_URL = (
    import.meta.env.VITE_API_URL ||
    defaultBackendUrl
).replace(/\/+$/, "");

const api = axios.create({
    baseURL: `${API_BASE_URL}/api/`,
});

api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("kathabook_access_token");

        if (accessToken) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem("kathabook_refresh_token");

            if (!refreshToken) {
                clearAuthAndRedirect();
                return Promise.reject(error);
            }

            try {
                const response = await api.post("auth/token/refresh/", {
                    refresh: refreshToken,
                });

                const newAccessToken = response.data.access;

                localStorage.setItem("kathabook_access_token", newAccessToken);

                originalRequest.headers = originalRequest.headers || {};
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return api(originalRequest);
            } catch (refreshError) {
                console.log("Refresh token failed:", refreshError.response?.data);

                clearAuthAndRedirect();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

function clearAuthAndRedirect() {
    localStorage.removeItem("kathabook_user");
    localStorage.removeItem("kathabook_access_token");
    localStorage.removeItem("kathabook_refresh_token");

    window.location.href = "/login";
}

export const loginUser = (data) =>
    api.post("auth/login/", data);

export const registerUser = (data) =>
    api.post("auth/register/", data);

export const forgotPassword = (data) =>
    api.post("auth/forgot-password/", data);

export const resetPassword = (data) =>
    api.post("auth/reset-password/", data);

export default api;
