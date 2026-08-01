import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
});

export async function register({ name, email, password }) { 
    try {
        const res = await axiosInstance.post("/auth/register", {
            name,
            email,
            password
        });
        return res.data;
    } catch (error) {
        console.error(error.response?.data || error.message);
        throw error;
    }
}

export async function login({ email, password }) {
    try {
        const res = await axiosInstance.post("/auth/login", {
            email,
            password
        });
        return res.data;
    } catch (error) {
        console.error(error.response?.data || error.message);
        throw error;
    }
}

export async function logout() {
    try {
        const res = await axiosInstance.post("/auth/logout");
        return res.data;
    } catch (error) {
        console.error(error.response?.data || error.message);
        throw error;
    }
}
  
export async function getMe() {
    try {
        const res = await axiosInstance.get("/auth/get-me");
        return res.data;
    } catch (error) {
        console.error(error.response?.data || error.message);
        throw error;
    }
}
