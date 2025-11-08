import axios from "axios";

const API_URL = "http://localhost:8000/api/auth/";

// Fungsi Register
export const register = async (email, username, full_name, major, role, password, password_confirmation) => {
    try {
        const response = await axios.post(`${API_URL}register/`, {
            email,
            username,
            full_name,
            major,
            role,
            password,
            password_confirmation
        });
        return response.data;
    } catch (error) {
        console.error("Registration failed:", error);
        throw error;
    }
}