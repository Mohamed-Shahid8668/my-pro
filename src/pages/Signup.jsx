import { useState } from "react";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    otp: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Request OTP function
  const requestOtp = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      alert("OTP sent to your email!");
    } catch (error) {
      alert(error.message);
    }
  };

  // ✅ Signup function
  const handleSignup = async () => {
    if (!formData.name || !formData.email || !formData.password || !formData.otp) {
      alert("All fields are required!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      alert("Signup Successful!");
      localStorage.setItem("token", data.token);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
      <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
      <button onClick={requestOtp}>Request OTP</button>
      <input type="text" name="otp" placeholder="Enter OTP" value={formData.otp} onChange={handleChange} />
      <button onClick={handleSignup}>Signup</button>
    </div>
  );
};

export default Signup;
