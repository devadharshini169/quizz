import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function Quiz() {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(300);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const username = localStorage.getItem("quizUsername");

  const attemptStarted = useRef(false);
  const submitted = useRef(false);

  // Start quiz and load questions
  useEffect(() => {
    if (!username) {
      navigate("/user");
      return;
    }

    if (attemptStarted.current) {
      return;
    }

    attemptStarted.current = true;

    const startQuiz = async () => {
      try {
        // Start quiz attempt
        const startResponse = await fetch(
          "http://127.0.0.1:8000/quiz/start",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: username,
            }),
          }
        );

        const startData = await startResponse.json();

        if (!startResponse.ok) {
          setMessage(
            startData.detail || "Unable to start quiz."
          );
          setLoading(false);
          return;
        }

        // Save attempt ID
        localStorage.setItem(
          "attemptId",
          startData.attempt_id
        );

        // Load questions
        const questionResponse = await fetch(
          "http://127.0.0.1:8000/questions/"
        );

        const questionData = await questionResponse.json();

        if (!questionResponse.ok) {
          setMessage("Unable to load questions.");
          setLoading(false);
          return;
        }

        if (questionData.length === 0) {
          setMessage("No questions available.");
          setLoading(false);
          return;
        }

        setQuestions(questionData);
        setLoading(false);

      } catch (error) {
        console.error("Quiz start error:", error);

        setMessage(
          "Unable to connect to backend."
        );

        setLoading(false);
      }
    };

    startQuiz();
  }, [navigate, username]);

  // Timer
  useEffect(() => {
    if (loading || questions.length === 0) {
      return;
    }

    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previous) => previous - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, loading, questions.length]);

  // Select answer
  const handleAnswer = (answer) => {
    if (submitting) {
      return;
    }

    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [questions[currentQuestion].id]: answer,
    }));
  };

  // Next question
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(
        currentQuestion + 1
      );
    }
  };

  // Previous question
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(
        currentQuestion - 1
      );
    }
  };

  // Submit quiz
  const handleSubmit = async () => {
    if (submitted.current || submitting) {
      return;
    }

    submitted.current = true;
    setSubmitting(true);

    const attemptId =
      localStorage.getItem("attemptId");

    if (!attemptId) {
      setMessage(
        "Quiz attempt not found."
      );
      submitted.current = false;
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/quiz/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            attempt_id: Number(attemptId),
            answers: answers,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Quiz submission response:",
        data
      );

      if (!response.ok) {
        setMessage(
          data.detail ||
            "Unable to submit quiz."
        );

        submitted.current = false;
        setSubmitting(false);
        return;
      }

      // Save backend result
      localStorage.setItem(
        "quizResult",
        JSON.stringify(data)
      );

      // Save answers
      localStorage.setItem(
        "quizAnswers",
        JSON.stringify(answers)
      );

      // Save questions
      localStorage.setItem(
        "quizQuestions",
        JSON.stringify(questions)
      );

      console.log(
        "Quiz result saved:",
        data
      );

      // Go to result page
      navigate("/result");

    } catch (error) {
      console.error(
        "Quiz submission error:",
        error
      );

      setMessage(
        "Unable to connect to backend."
      );

      submitted.current = false;
      setSubmitting(false);
    }
  };

  // Format timer
  const formatTime = () => {
    const minutes = Math.floor(
      timeLeft / 60
    );

    const seconds = timeLeft % 60;

    return `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Loading screen
  if (loading) {
    return (
      <div className="app-container">
        <div className="quiz-card">

          <h1>Loading Quiz...</h1>

          {message && (
            <p style={{ color: "#fbbf24" }}>
              {message}
            </p>
          )}

        </div>
      </div>
    );
  }

  // Error screen
  if (
    message &&
    questions.length === 0
  ) {
    return (
      <div className="app-container">
        <div className="quiz-card">

          <h1>Unable to Start Quiz</h1>

          <p style={{ color: "#fbbf24" }}>
            {message}
          </p>

          <button
            onClick={() =>
              navigate("/user")
            }
          >
            Back
          </button>

        </div>
      </div>
    );
  }

  // No questions
  if (questions.length === 0) {
    return (
      <div className="app-container">
        <div className="quiz-card">

          <h1>No Questions Available</h1>

          <p>
            Please ask the administrator
            to add questions.
          </p>

        </div>
      </div>
    );
  }

  const question =
    questions[currentQuestion];

  const selectedAnswer =
    answers[question.id];

  return (
    <div className="app-container">

      <div
        className="quiz-card"
        style={{ maxWidth: "800px" }}
      >

        {/* Timer */}
        <div className="timer">
          Time Left: {formatTime()}
        </div>

        <h1>Online Quiz</h1>

        {/* Username */}
        <p>
          <strong>Candidate:</strong>{" "}
          {username}
        </p>

        {/* Question number */}
        <p>
          Question{" "}
          {currentQuestion + 1} of{" "}
          {questions.length}
        </p>

        {/* Question */}
        <h2>
          {question.question}
        </h2>

        {/* Options */}
        <div
          style={{
            marginTop: "25px",
          }}
        >

          <button
            className="option"
            disabled={submitting}
            style={{
              background:
                selectedAnswer ===
                question.option1
                  ? "rgba(99,102,241,0.5)"
                  : "rgba(255,255,255,0.1)",
            }}
            onClick={() =>
              handleAnswer(
                question.option1
              )
            }
          >
            {question.option1}
          </button>

          <button
            className="option"
            disabled={submitting}
            style={{
              background:
                selectedAnswer ===
                question.option2
                  ? "rgba(99,102,241,0.5)"
                  : "rgba(255,255,255,0.1)",
            }}
            onClick={() =>
              handleAnswer(
                question.option2
              )
            }
          >
            {question.option2}
          </button>

          <button
            className="option"
            disabled={submitting}
            style={{
              background:
                selectedAnswer ===
                question.option3
                  ? "rgba(99,102,241,0.5)"
                  : "rgba(255,255,255,0.1)",
            }}
            onClick={() =>
              handleAnswer(
                question.option3
              )
            }
          >
            {question.option3}
          </button>

          <button
            className="option"
            disabled={submitting}
            style={{
              background:
                selectedAnswer ===
                question.option4
                  ? "rgba(99,102,241,0.5)"
                  : "rgba(255,255,255,0.1)",
            }}
            onClick={() =>
              handleAnswer(
                question.option4
              )
            }
          >
            {question.option4}
          </button>

        </div>

        {/* Navigation buttons */}
        <div
          style={{
            marginTop: "30px",
            display: "flex",
            justifyContent:
              "space-between",
            gap: "10px",
          }}
        >

          <button
            onClick={handlePrevious}
            disabled={
              currentQuestion === 0 ||
              submitting
            }
          >
            Previous
          </button>

          {currentQuestion ===
          questions.length - 1 ? (

            <button
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting
                ? "Submitting..."
                : "Submit Quiz"}
            </button>

          ) : (

            <button
              onClick={handleNext}
              disabled={submitting}
            >
              Next
            </button>

          )}

        </div>

        {/* Error/message */}
        {message && (
          <p
            style={{
              color: "#fbbf24",
              marginTop: "20px",
            }}
          >
            {message}
          </p>
        )}

      </div>

    </div>
  );
}

export default Quiz;