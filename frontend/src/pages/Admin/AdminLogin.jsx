import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setMessage("Please enter username and password");
      return;
    }

    try {
      const response = await fetch(
        "https://quizz-mkkz.onrender.com/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        navigate("/admin/dashboard");
      } else {
        setMessage("Invalid username or password");
      }
    } catch (error) {
      setMessage("Unable to connect to backend");
    }
  };

  return (
    <div className="app-container">
      <div className="quiz-card">

        <h1>Admin Login</h1>

        <form onSubmit={handleLogin}>

          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <br />
          <br />

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <br />
          <br />

          <button type="submit">
            Login
          </button>

        </form>

        {message && (
          <p style={{ color: "#fbbf24" }}>
            {message}
          </p>
        )}

      </div>
    </div>
  );
}

export default AdminLogin;