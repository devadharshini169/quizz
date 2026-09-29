import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Results() {
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(
          "https://quizz-mkkz.onrender.com/results/"
        );

        const data = await response.json();

        if (!response.ok) {
          setMessage("Unable to load results.");
          return;
        }

        setResults(data);
      } catch (error) {
        console.error("Results error:", error);
        setMessage("Unable to connect to backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  return (
    <div className="app-container">
      <div
        className="quiz-card"
        style={{ maxWidth: "1000px" }}
      >
        <h1>Quiz Results</h1>

        <p>
          View the results of all students who completed
          the quiz.
        </p>

        {loading && (
          <p>Loading results...</p>
        )}

        {message && (
          <p style={{ color: "#fbbf24" }}>
            {message}
          </p>
        )}

        {!loading &&
          !message &&
          results.length === 0 && (
            <p>No quiz results available.</p>
          )}

        {!loading &&
          !message &&
          results.length > 0 && (
            <div
              style={{
                overflowX: "auto",
                marginTop: "25px",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr>
                    <th style={tableHeaderStyle}>#</th>
                    <th style={tableHeaderStyle}>Student</th>
                    <th style={tableHeaderStyle}>Score</th>
                    <th style={tableHeaderStyle}>Total</th>
                    <th style={tableHeaderStyle}>
                      Percentage
                    </th>
                    <th style={tableHeaderStyle}>
                      Submitted
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {results.map((result, index) => (
                    <tr key={result.result_id}>
                      <td style={tableCellStyle}>
                        {index + 1}
                      </td>

                      <td style={tableCellStyle}>
                        {result.username}
                      </td>

                      <td style={tableCellStyle}>
                        {result.score}
                      </td>

                      <td style={tableCellStyle}>
                        {result.total_questions}
                      </td>

                      <td style={tableCellStyle}>
                        {result.percentage}%
                      </td>

                      <td style={tableCellStyle}>
                        {result.submitted_at
                          ? new Date(
                              result.submitted_at
                            ).toLocaleString()
                          : "Not available"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        <div
          style={{
            marginTop: "30px",
            textAlign: "center",
          }}
        >
          <button
            onClick={() =>
              navigate("/admin/dashboard")
            }
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

const tableHeaderStyle = {
  padding: "14px",
  borderBottom:
    "1px solid rgba(255,255,255,0.2)",
  textAlign: "left",
  color: "#ffffff",
};

const tableCellStyle = {
  padding: "14px",
  borderBottom:
    "1px solid rgba(255,255,255,0.1)",
  color: "#e2e8f0",
};

export default Results;