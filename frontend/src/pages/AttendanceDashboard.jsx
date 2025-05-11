import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import * as XLSX from 'xlsx';
import 'jspdf-autotable';
import "./Attendance.css";

const API = "http://localhost:5000/api";

export default function AttendanceDashboard() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [draggedItem, setDraggedItem] = useState(null);
  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken");
    return token
      ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
      : {};
  };

  useEffect(() => {
    const filtered = students.filter(student => {
      const nameMatch = (student.name || "").toLowerCase().includes(searchTerm.toLowerCase());
      const idMatch = (student.studentId || "").toLowerCase().includes(searchTerm.toLowerCase());
      return nameMatch || idMatch;
    });
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(`${API}/students`, {
          method: "GET",
          headers: getAuthHeaders(),
        });

        if (res.status === 401) {
          setError("Unauthorized! Please log in again.");
          return navigate("/auth");
        }

        const data = await res.json();
        setStudents(data);
        setFilteredStudents(data);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Failed to fetch students.");
      }
    };

    const fetchAttendance = async () => {
      try {
        const res = await fetch(`${API}/biometric-attendance?date=${selectedDate}`, {
          method: "GET",
          headers: getAuthHeaders(),
        });

        if (res.status === 401) {
          return navigate("/auth");
        }

        const contentType = res.headers.get("Content-Type");
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          const attendanceMap = {};
          const cutoff = new Date(`${selectedDate}T09:30:00`);

          data.forEach(entry => {
            if (entry.verified && new Date(entry.timestamp) <= cutoff) {
              attendanceMap[entry.studentId] = "present";
            } else {
              attendanceMap[entry.studentId] = "absent";
            }
          });

          setAttendance(attendanceMap);
        } else {
          const text = await res.text();
          console.error("Unexpected response:", text);
          setError("Unexpected error. Please try again.");
        }
      } catch (err) {
        console.error("Error fetching biometric attendance:", err);
        setError("Failed to fetch attendance.");
      }
    };

    fetchStudents();
    fetchAttendance();
  }, [selectedDate, navigate]);

  const downloadExcel = () => {
    const data = filteredStudents.map(student => ({
      "S.No": filteredStudents.indexOf(student) + 1,
      "Name": student.name,
      "Register Number": student.studentId,
      "Status": attendance[student._id] || "Not marked",
      "Date": selectedDate
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    XLSX.writeFile(workbook, `Attendance_${selectedDate}.xlsx`);
  };

  // Drag and drop sorting
  const handleDragStart = (e, index) => {
    setDraggedItem(filteredStudents[index]);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (index) => {
    if (!draggedItem) return;
    const draggedOverItem = filteredStudents[index];
    if (draggedItem === draggedOverItem) return;

    const items = [...filteredStudents];
    const draggedIndex = items.indexOf(draggedItem);
    items.splice(draggedIndex, 1);
    items.splice(index, 0, draggedItem);
    setFilteredStudents(items);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  return (
    <div className="dashboard">
      <Link to="/dashboard">🏠 Dashboard</Link>
      <h2>📅 Attendance Dashboard</h2>

      <div className="controls">
        <div className="date-picker">
          <label>Select Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="download-buttons">
          <button onClick={downloadExcel}>Download Excel</button>
        </div>
      </div>

      {error && <p className="status-message error">{error}</p>}
      {message && <p className="status-message">{message}</p>}
      {filteredStudents.length === 0 && !error && <p>No students found.</p>}

      <table className="attendance-table">
        <thead>
          <tr>
            <th>SI.NO</th>
            <th>Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student, idx) => (
            <tr
              key={student._id}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={() => handleDragOver(idx)}
              onDragEnd={handleDragEnd}
              className={draggedItem === student ? "dragging" : ""}
            >
              <td>{idx + 1}</td>
              <td>{student.name}</td>
              <td>{attendance[student._id] || "Not marked"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
