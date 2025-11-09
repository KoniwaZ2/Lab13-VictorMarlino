import React, { useState, useEffect } from "react";
import { getNilai, addNilai, getStudents } from "../services/nilai";

function DashboardDosen({ user, onLogout }) {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    mahasiswa_id: "",
    matkul: "",
    nilai: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);

  // Validasi role - hanya dosen yang boleh akses
  useEffect(() => {
    if (user.role !== "instructor") {
      setError("Akses ditolak. Dashboard ini hanya untuk dosen.");
      setLoading(false);
      return;
    }
  }, [user]);

  useEffect(() => {
    // Skip fetch jika bukan instructor
    if (user.role !== "instructor") return;

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

  useEffect(() => {
    // Fetch students when form is shown
    if (showForm && user.role === "instructor") {
      const fetchStudents = async () => {
        try {
          const data = await getStudents();
          setStudents(data);
        } catch (err) {
          console.error("Failed to fetch students:", err);
          setFormError("Gagal memuat daftar mahasiswa.");
        }
      };
      fetchStudents();
    }
  }, [showForm, user.role]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitGrade = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      // Validate form
      if (!formData.mahasiswa_id || !formData.matkul || !formData.nilai) {
        setFormError("Semua field harus diisi.");
        setIsSubmitting(false);
        return;
      }

      const nilaiNum = parseFloat(formData.nilai);
      if (isNaN(nilaiNum) || nilaiNum < 0 || nilaiNum > 100) {
        setFormError("Nilai harus berupa angka antara 0 dan 100.");
        setIsSubmitting(false);
        return;
      }

      await addNilai(
        parseInt(formData.mahasiswa_id),
        formData.matkul,
        nilaiNum
      );

      setFormSuccess("Nilai berhasil ditambahkan!");
      setFormData({
        mahasiswa_id: "",
        matkul: "",
        nilai: "",
      });

      // Refresh grades list
      const data = await getNilai();
      setGrades(data);

      // Hide form after 2 seconds
      setTimeout(() => {
        setShowForm(false);
        setFormSuccess(null);
      }, 2000);
    } catch (err) {
      console.error("Failed to add grade:", err);
      if (err.response && err.response.data) {
        // Show backend error message
        const errorMsg =
          err.response.data.detail ||
          err.response.data.error ||
          JSON.stringify(err.response.data);
        setFormError(errorMsg);
      } else {
        setFormError("Gagal menambahkan nilai. Silakan coba lagi.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const getStudentName = (mahasiswa) => {
    // mahasiswa may be an object or a string/ID depending on API
    if (!mahasiswa) return "-";
    if (typeof mahasiswa === "object") {
      return (
        mahasiswa.full_name ||
        mahasiswa.email ||
        mahasiswa.username ||
        mahasiswa.id ||
        "-"
      );
    }
    return mahasiswa;
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
    if (!major) return "-";
    return majorMap[major] || major;
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="user-info">
          <h1>Dashboard Dosen</h1>
          <p className="welcome-text">Selamat datang, {user.full_name}</p>
          <div className="user-details">
            <span className="badge badge-major">
              {getMajorAbbreviation(user.major)}
            </span>
            <span className="badge">{user.email}</span>
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
      ) : (
        <>
          <div className="action-bar">
            <button
              className="btn-add-grade"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "Tutup Form" : "➕ Tambah Nilai"}
            </button>
          </div>

          {showForm && (
            <div className="form-container">
              <h3>Tambah Nilai Mahasiswa</h3>
              <form onSubmit={handleSubmitGrade} className="grade-form">
                <div className="form-group">
                  <label htmlFor="mahasiswa_id">Pilih Mahasiswa:</label>
                  <select
                    id="mahasiswa_id"
                    name="mahasiswa_id"
                    value={formData.mahasiswa_id}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">-- Pilih Mahasiswa --</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.full_name} ({student.email}) -{" "}
                        {getMajorAbbreviation(student.major)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="matkul">Pilih Mata Kuliah:</label>
                  <select
                    id="matkul"
                    name="matkul"
                    value={formData.matkul}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">-- Pilih Mata Kuliah --</option>
                    {user.matkul_diajar &&
                      user.matkul_diajar.map((matkul, index) => (
                        <option key={index} value={matkul}>
                          {matkul}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="nilai">Nilai (0-100):</label>
                  <input
                    type="number"
                    id="nilai"
                    name="nilai"
                    value={formData.nilai}
                    onChange={handleFormChange}
                    min="0"
                    max="100"
                    step="0.01"
                    required
                    placeholder="Masukkan nilai"
                  />
                </div>

                {formError && <p className="error-message">{formError}</p>}
                {formSuccess && (
                  <p className="success-message">{formSuccess}</p>
                )}

                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn-submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Menyimpan..." : "Simpan Nilai"}
                  </button>
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => {
                      setShowForm(false);
                      setFormError(null);
                      setFormSuccess(null);
                      setFormData({
                        mahasiswa_id: "",
                        matkul: "",
                        nilai: "",
                      });
                    }}
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          )}

          {grades.length === 0 ? (
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
                      <th>Nama Mahasiswa</th>
                      <th>Mata Kuliah</th>
                      <th>Nilai Angka</th>
                      <th>Nilai Huruf</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grades.map((grade, index) => (
                      <tr key={index} className={getGradeColor(grade.nilai)}>
                        <td>{index + 1}</td>
                        <td className="student-name">
                          {getStudentName(grade.mahasiswa)}
                        </td>
                        <td className="course-name">{grade.matkul}</td>
                        <td className="grade-score">{grade.nilai}</td>
                        <td className="grade-letter">
                          <span
                            className={`letter-badge ${getGradeColor(
                              grade.nilai
                            )}`}
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
        </>
      )}
    </div>
  );
}

export default DashboardDosen;
