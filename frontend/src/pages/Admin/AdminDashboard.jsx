import { Link } from "react-router-dom";

function AdminDashboard() {
  return (
    <div className="app-container">
      <div className="quiz-card">

        <h1>Admin Dashboard</h1>

        <p>
          Welcome to the Online Quiz Management System.
        </p>

        <div style={{ marginTop: "30px" }}>

          <Link to="/admin/questions">
            <button style={{ margin: "10px" }}>
              Manage Questions
            </button>
          </Link>

          <Link to="/admin/create-question">
            <button style={{ margin: "10px" }}>
              Create Question
            </button>
          </Link>

          <Link to="/admin/results">
            <button style={{ margin: "10px" }}>
              View Results
            </button>
          </Link>

        </div>

        <div style={{ marginTop: "30px" }}>
          <Link to="/">
            <button>
              Logout
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;