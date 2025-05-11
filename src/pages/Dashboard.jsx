import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import StudentTable from "../components/StudentTable";
import StudentForm from "../components/StudentForm";
import "./Dashboard.css";

// API base URL
const API_BASE_URL = "http://localhost:5000";

export default function Dashboard({ setIsAuthenticated }) {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // ✅ Loading state
  const navigate = useNavigate();

  // ✅ Logout handler - no authorization needed
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/auth");
  };

  // 🟢 Fetch students on mount (still requires auth)
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true); // Start loading
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Unauthorized! Token missing. Please login.");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/students`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        setError("Unauthorized! Please log in again.");
        return;
      }

      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error("Error fetching students:", err);
      setError("Failed to fetch students. Try again later.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const addStudent = async (newStudent) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Unauthorized! Please login again.");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newStudent),
      });

      if (res.ok) {
        fetchStudents();
      } else {
        const data = await res.json();
        throw new Error(data.error || "Failed to add student.");
      }
    } catch (err) {
      console.error("❌ Add Student Error:", err);
      setError("Failed to add student. Try again later.");
    }
  };

  const handleScan = async (studentId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Unauthorized! Please login again.");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/biometric-attendance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          studentId,
          verified: true, // or false if failed
          timestamp: new Date().toISOString(), // optional
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Biometric scan stored successfully!");
      } else {
        alert("Biometric scan failed: " + data.error);
      }
    } catch (err) {
      console.error("❌ Biometric Scan Error:", err);
      alert("Failed to scan biometric. Try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Unauthorized! Please login again.");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/students/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setStudents((prev) => prev.filter((student) => student._id !== id));
      } else {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete student.");
      }
    } catch (err) {
      console.error("❌ Delete Error:", err);
      setError("Failed to delete student. Try again later.");
    }
  };

  const updateStudent = async (id, updatedData) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Unauthorized! Please login again.");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/students/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        fetchStudents();
      } else {
        const data = await res.json();
        throw new Error(data.error || "Failed to update student.");
      }
    } catch (err) {
      console.error("❌ Update Error:", err);
      setError("Failed to update student. Try again later.");
    }
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-links">
          <Link to="/attendance">Attendance Dashboard</Link>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </nav>

      <div className="dashboard-container">
        <h2 className="dashboard-title">Student Dashboard</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {loading && <p>Loading students...</p>}
        <StudentForm addStudent={addStudent} />
        {students.length > 0 ? (
          <StudentTable
            students={students}
            handleDelete={handleDelete}
            updateStudent={updateStudent}
            handleScan={handleScan}
          />
        ) : (
          <p>No students found.</p>
        )}
      </div>
    </div>
  );
}
