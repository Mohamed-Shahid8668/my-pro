import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import "./Auth.css"; // ✅ Import Amazon-style CSS

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleAuth = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        {isLogin ? <Login /> : <Signup />}
        <p onClick={toggleAuth} className="toggle-auth">
          {isLogin ? "Create your account" : "Already have an account? Sign in"}
        </p>
      </div>
    </div>
  );
}
