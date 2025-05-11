import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // Clear user data
    navigate("/login");
  };

  const handleNavigateToAttendance = () => {
    navigate("/attendance");
  };

  return (
    <nav className="navbar">
      <h1>Nellai College of Engineering - CSE</h1>
      
      {/* Button to navigate to Attendance Dashboard */}
      <button onClick={handleNavigateToAttendance} className="attendance-button">
        Attendance Dashboard
      </button>

      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </nav>
  );
}
