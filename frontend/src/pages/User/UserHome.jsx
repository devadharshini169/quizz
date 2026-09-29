import { useState } from "react";
import { useNavigate } from "react-router-dom";

function UserHome() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleStartQuiz = (e) => {
    e.preventDefault();

    if (!username.trim()) {
      setMessage("Please enter your name.");
      return;
    }

    // Store username for the quiz
    localStorage.setItem("quizUsername", username.trim());

    // Go to quiz page
    navigate("/quiz");
  };

  return (
    <div className="app-container">
      <div className="quiz-card">
        <h1>Start Quiz</h1>

        <p>
          Enter your name below to start the online quiz.
        </p>

        <form onSubmit={handleStartQuiz}>
          <input
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <br />
          <br />

          <button type="submit">
            Start Quiz
          </button>
        </form>

        {message && (
          <p style={{ color: "#fbbf24" }}>
            {message}
          </p>
        )}

        <br />

        <button onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default UserHome;