import { useState } from "react";
import "./RF.css";

const API_URL = import.meta.env.VITE_API_URL;

function AuthPage() {
  const [isActive, setIsActive] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: ""
  });

  // 🔐 LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        alert("Login successful");
        window.location.href = "/dashboard";
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Server error");
    }
  };

  // 📝 REGISTER
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(registerData)
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registered successfully");
        setIsActive(false);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Error");
    }
  };

  return (
    <div className={`container ${isActive ? "active" : ""}`}>

      {/* LOGIN */}
      <div className="form-container login">
        <form onSubmit={handleLogin}>
          <h1>Login</h1>

          <input
            type="email"
            placeholder="Email"
            required
            onChange={(e) =>
              setLoginData({ ...loginData, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            required
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
          />

          <button type="submit">Login</button>
        </form>
      </div>

      {/* REGISTER */}
      <div className="form-container register">
        <form onSubmit={handleRegister}>
          <h1>Register</h1>

          <input
            type="text"
            placeholder="Name"
            required
            onChange={(e) =>
              setRegisterData({ ...registerData, name: e.target.value })
            }
          />

          <input
            type="email"
            placeholder="Email"
            required
            onChange={(e) =>
              setRegisterData({ ...registerData, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            required
            onChange={(e) =>
              setRegisterData({ ...registerData, password: e.target.value })
            }
          />

          <button type="submit">Register</button>
        </form>
      </div>

      {/* TOGGLE */}
      <div className="toggle-container">
        <div className="toggle">

          <div className="toggle-panel toggle-left">
            <h1>Welcome!</h1>
            <button type="button" onClick={() => setIsActive(false)}>
              Login
            </button>
          </div>

          <div className="toggle-panel toggle-right">
            <h1>Hello!</h1>
            <button type="button" onClick={() => setIsActive(true)}>
              Register
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}

export default AuthPage;