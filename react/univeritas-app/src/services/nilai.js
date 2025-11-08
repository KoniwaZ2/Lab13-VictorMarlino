import axios from "axios";

const API_URL = "http://localhost:8000/api/auth/";

// Fungsi untuk mendapatkan nilai mahasiswa
export const getNilai = async () => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axios.get(`${API_URL}nilai/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch grades:", error);
    throw error;
  }
};

// Fungsi untuk menambah nilai (untuk instructor)
export const addNilai = async (mahasiswaId, matkul, nilai) => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axios.post(
      `${API_URL}nilai/`,
      {
        mahasiswa_id: mahasiswaId,
        matkul,
        nilai,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to add grade:", error);
    throw error;
  }
};
