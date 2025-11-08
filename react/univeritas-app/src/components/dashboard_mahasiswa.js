import React, { useState, useEffect } from "react";
import { getNilai } from "../services/nilai";

function DashboardMahasiswa({ user, onLogout }) {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Validasi role - hanya student yang boleh akses
  useEffect(() => {
    if (user.role !== "student") {
      setError("Akses ditolak. Dashboard ini hanya untuk mahasiswa.");
      setLoading(false);
      return;
    }
  }, [user]);

  useEffect(() => {
    // Skip fetch jika bukan student
    if (user.role !== "student") return;

    const fetchGrades = async () => {
      try {
        setLoading(true);
        const data = await getNilai();
        setGrades(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch grades:", err);
        setError("Gagal memuat data nilai. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, [user.role]);

  const getGradeColor = (nilai) => {
    if (nilai >= 80) return "grade-a";
    if (nilai >= 70) return "grade-b";
    if (nilai >= 60) return "grade-c";
    if (nilai >= 50) return "grade-d";
    return "grade-e";
  };

  const getLetterGrade = (nilai) => {
    if (nilai >= 80) return "A";
    if (nilai >= 70) return "B";
    if (nilai >= 60) return "C";
    if (nilai >= 50) return "D";
    return "E";
  };

  const getMajorAbbreviation = (major) => {
    const majorMap = {
      artificial_intelligence_and_robotics: "AIR",
      business_mathematics: "BM",
      digital_business_technology: "DBT",
      product_design_engineering: "PDE",
      energy_business_technology: "EBT",
      food_business_technology: "FBT",
    };
    return majorMap[major] || major;
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="user-info">
          <h1>Dashboard Mahasiswa</h1>
          <p className="welcome-text">Selamat datang, {user.full_name}</p>
          <div className="user-details">
            <span className="badge">{user.email}</span>
            <span className="badge">{getMajorAbbreviation(user.major)}</span>
            <span className="badge badge-role">{user.role}</span>
          </div>
        </div>
        <button className="btn-logout" onClick={onLogout}>
          Logout
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Memuat data nilai...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button
            className="btn-retry"
            onClick={() => window.location.reload()}
          >
            Coba Lagi
          </button>
        </div>
      ) : grades.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>Belum Ada Data Nilai</h3>
          <p>Nilai mata kuliah Anda akan ditampilkan di sini.</p>
        </div>
      ) : (
        <div className="grades-container">
          <h2>Daftar Nilai Mata Kuliah</h2>
          <div className="table-wrapper">
            <table className="grades-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Mata Kuliah</th>
                  <th>Nilai Angka</th>
                  <th>Nilai Huruf</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((grade, index) => (
                  <tr key={index} className={getGradeColor(grade.nilai)}>
                    <td>{index + 1}</td>
                    <td className="course-name">{grade.matkul}</td>
                    <td className="grade-score">{grade.nilai}</td>
                    <td className="grade-letter">
                      <span
                        className={`letter-badge ${getGradeColor(grade.nilai)}`}
                      >
                        {getLetterGrade(grade.nilai)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardMahasiswa;
