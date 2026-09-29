import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="app-container">
      <div className="quiz-card">

        <h1>Online Quiz Management System</h1>

        <p>
          Test your knowledge with our online quiz system.
          Choose an option below to continue.
        </p>

        <div style={{ marginTop: "30px", textAlign: "center" }}>

          <Link to="/admin">
            <button style={{ margin: "10px" }}>
              Admin Login
            </button>
          </Link>

          <Link to="/user">
            <button style={{ margin: "10px" }}>
              Start Quiz
            </button>
          </Link>

        </div>

      </div>
    </div>
  );
}

export default Home;