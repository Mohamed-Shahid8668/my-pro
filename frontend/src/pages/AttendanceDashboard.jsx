import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import * as XLSX from 'xlsx';
import 'jspdf-autotable';
import "./Attendance.css";

export default function AttendanceDashboard() {
  const getTodayDate = () => format(new Date(), "yyyy-MM-dd");
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [draggedItem, setDraggedItem] = useState(null);
  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken");
    console.log("Using token:", token);
    return token
      ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
      : {};
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(`https://my-pro-tfct.onrender.com/api/students`, {
          method: "GET",
          headers: getAuthHeaders(),
        });
        if (!res.ok) throw new Error(`Error: ${res.statusText}`);
        const contentType = res.headers.get("Content-Type");
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          setStudents(data);
          setFilteredStudents(data);
        } else throw new Error("Unexpected response format.");
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Failed to fetch students.");
      }
    };

    const fetchAttendance = async () => {
      try {
        const res = await fetch(`https://my-pro-tfct.onrender.com/api/biometric-attendance?date=${selectedDate}`, {
          method: "GET",
          headers: getAuthHeaders(),
        });
        if (!res.ok) throw new Error(`Error: ${res.statusText}`);
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
        } else throw new Error("Unexpected response format.");
      } catch (err) {
        console.error("Error fetching biometric attendance:", err);
        setError("");
      }
    };

    fetchStudents();
    fetchAttendance();

    // Auto-update date every minute
    const interval = setInterval(() => {
      setSelectedDate(getTodayDate());
    }, 60000);

    return () => clearInterval(interval);
  }, [selectedDate, navigate]);

 useEffect(() => {
  const timer = setTimeout(() => {
    const filtered = students.filter(student => {
      const nameMatch = (student.name || "").toLowerCase().includes(searchTerm.toLowerCase());
      const idMatch = (student.studentId || "").toLowerCase().includes(searchTerm.toLowerCase());
      return nameMatch || idMatch;
    });
    setFilteredStudents(filtered);
  }, 300); // Debounce delay (300ms)

  return () => clearTimeout(timer);
}, [searchTerm, students]);

  const downloadExcel = () => {
    const data = filteredStudents.map((student, index) => ({
      "S.No": index + 1,
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
        <div className="date-display">
          <label>Today's Date:</label>
          <span>{selectedDate}</span>
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
