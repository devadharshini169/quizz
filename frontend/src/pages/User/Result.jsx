import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Result() {
  const navigate = useNavigate();

  const [result, setResult] = useState(null);

  useEffect(() => {
    const savedResult =
      localStorage.getItem("quizResult");

    console.log(
      "Saved Quiz Result:",
      savedResult
    );

    if (savedResult) {
      try {
        const data = JSON.parse(savedResult);

        setResult(data);
      } catch (error) {
        console.error(
          "Error reading quiz result:",
          error
        );
      }
    }
  }, []);

  const handleFinish = () => {
    localStorage.removeItem("quizUsername");
    localStorage.removeItem("quizAnswers");
    localStorage.removeItem("quizQuestions");
    localStorage.removeItem("quizResult");
    localStorage.removeItem("attemptId");

    navigate("/");
  };

  if (!result) {
    return (
      <div className="app-container">
        <div className="quiz-card">

          <h1>Result Not Found</h1>

          <p>
            The quiz result was not received.
          </p>

          <button
            onClick={() =>
              navigate("/user")
            }
          >
            Back to Start Quiz
          </button>

        </div>
      </div>
    );
  }

  const totalQuestions =
    result.total_questions;

  const correctAnswers =
    result.score;

  const wrongAnswers =
    totalQuestions - correctAnswers;

  const percentage =
    Number(result.percentage);

  /*
    Calculate the pie chart angle.
    Example:
    80% = 288 degrees
  */
  const pieAngle =
    Math.max(
      0,
      Math.min(100, percentage)
    ) * 3.6;

  return (
    <div className="app-container">

      <div className="quiz-card">

        <h1>Quiz Result</h1>

        <p
          style={{
            textAlign: "center",
          }}
        >
          Well done,{" "}
          <strong>
            {result.username}
          </strong>
          !
        </p>


        {/* PIE CHART */}

        <div className="result-section">

          <div
            className="pie-chart"
            style={{
              background: `conic-gradient(
                #14b8a6 0deg ${pieAngle}deg,
                #334155 ${pieAngle}deg 360deg
              )`,
            }}
          >

            <div className="pie-chart-text">

              <span className="pie-chart-percentage">
                {percentage}%
              </span>

              <span className="pie-chart-label">
                Score
              </span>

            </div>

          </div>

          <p
            style={{
              textAlign: "center",
              marginTop: "18px",
            }}
          >
            Your overall quiz performance
          </p>

        </div>


        {/* RESULT DETAILS */}

        <div className="result-details">

          <div className="result-item">

            <strong>
              {totalQuestions}
            </strong>

            <span>
              Total Questions
            </span>

          </div>


          <div className="result-item">

            <strong>
              {correctAnswers}
            </strong>

            <span>
              Correct Answers
            </span>

          </div>


          <div className="result-item">

            <strong>
              {wrongAnswers}
            </strong>

            <span>
              Wrong Answers
            </span>

          </div>


          <div className="result-item">

            <strong>
              {percentage}%
            </strong>

            <span>
              Percentage
            </span>

          </div>

        </div>


        {/* SCORE */}

        <div
          style={{
            marginTop: "25px",
            textAlign: "center",
          }}
        >

          <p>
            <strong>
              Score:
            </strong>{" "}
            {correctAnswers} /{" "}
            {totalQuestions}
          </p>

        </div>


        {/* FINISH */}

        <div
          style={{
            marginTop: "25px",
            textAlign: "center",
          }}
        >

          <button
            onClick={handleFinish}
          >
            Finish
          </button>

        </div>

      </div>

    </div>
  );
}

export default Result;