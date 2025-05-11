import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css"; // ✅ Import CSS

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://my-pro-tfct.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.token) {
          localStorage.setItem("authToken", data.token); // ✅ Save token under consistent key
          alert("✅ Login Successful! Redirecting...");
          navigate("/dashboard");
        } else {
          alert("❌ Login failed: No token received");
        }
      } else {
        alert(`❌ Login Failed: ${data.error || data.message}`);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("❌ Server Error! Try again.");
    }
  };

  return (
    <form onSubmit={handleLogin} className="auth-form">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
        required
      />
      <button type="submit" className="btn-auth">Sign in</button>
    </form>
  );
};

export default Login;
