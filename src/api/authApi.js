import api from "./axios";
import publicApi from "./publicApi";
export const loginUser = (data) => publicApi.post("/auth/login/", data);
export const getMe = () => api.get("/auth/me/");



export const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};