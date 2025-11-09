import axios from "axios";

const API_URL = "http://localhost:8000/api/auth/";

// Fungsi Register
export const register = async (
  email,
  username,
  full_name,
  major,
  role,
  password,
  password_confirmation,
  matkul_diajar = ""
) => {
  try {
    // Parse matkul_diajar dari string comma-separated ke array
    const matkulArray = matkul_diajar
      ? matkul_diajar
          .split(",")
          .map((m) => m.trim())
          .filter((m) => m.length > 0)
      : [];

    const payload = {
      email,
      username,
      full_name,
      major,
      role,
      password,
      password_confirmation,
    };

    // Hanya tambahkan matkul_diajar jika user adalah instructor
    if (role === "instructor" && matkulArray.length > 0) {
      payload.matkul_diajar = matkulArray;
    }

    const response = await axios.post(`${API_URL}register/`, payload);
    return response.data;
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
};
