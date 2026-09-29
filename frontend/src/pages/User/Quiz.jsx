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

  // =========================================
  // START QUIZ AND LOAD QUESTIONS
  // =========================================

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
        const startResponse = await fetch(
          "https://quizz-mkkz.onrender.com/quiz/start",
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

        localStorage.setItem(
          "attemptId",
          startData.attempt_id
        );

        // Load questions from Render backend
        const questionResponse = await fetch(
          "https://quizz-mkkz.onrender.com/questions/"
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


  // =========================================
  // TIMER
  // =========================================

  useEffect(() => {
    if (loading || questions.length === 0) {
      return;
    }

    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(
        (previous) => previous - 1
      );
    }, 1000);

    return () => clearInterval(timer);

  }, [
    timeLeft,
    loading,
    questions.length
  ]);


  // =========================================
  // SELECT ANSWER
  // =========================================

  const handleAnswer = (answer) => {
    if (submitting) {
      return;
    }

    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [questions[currentQuestion].id]: answer,
    }));
  };


  // =========================================
  // NEXT QUESTION
  // =========================================

  const handleNext = () => {
    if (
      currentQuestion <
      questions.length - 1
    ) {
      setCurrentQuestion(
        currentQuestion + 1
      );
    }
  };


  // =========================================
  // PREVIOUS QUESTION
  // =========================================

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(
        currentQuestion - 1
      );
    }
  };


  // =========================================
  // SUBMIT QUIZ
  // =========================================

  const handleSubmit = async () => {
    if (
      submitted.current ||
      submitting
    ) {
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
        "https://quizz-mkkz.onrender.com/quiz/submit",
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

      // Save result
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


  // =========================================
  // FORMAT TIMER
  // =========================================

  const formatTime = () => {
    const minutes = Math.floor(
      timeLeft / 60
    );

    const seconds = timeLeft % 60;

    return `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };


  // =========================================
  // LOADING SCREEN
  // =========================================

  if (loading) {
    return (
      <div className="app-container">

        <div className="quiz-card">

          <h1>
            Loading Quiz...
          </h1>

          {message && (
            <p
              style={{
                color: "#fbbf24",
              }}
            >
              {message}
            </p>
          )}

        </div>

      </div>
    );
  }


  // =========================================
  // ERROR SCREEN
  // =========================================

  if (
    message &&
    questions.length === 0
  ) {
    return (
      <div className="app-container">

        <div className="quiz-card">

          <h1>
            Unable to Start Quiz
          </h1>

          <p
            style={{
              color: "#fbbf24",
            }}
          >
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


  // =========================================
  // NO QUESTIONS
  // =========================================

  if (questions.length === 0) {
    return (
      <div className="app-container">

        <div className="quiz-card">

          <h1>
            No Questions Available
          </h1>

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


  // =========================================
  // QUIZ PAGE
  // =========================================

  return (
    <div className="app-container">

      <div
        className="quiz-card"
        style={{
          maxWidth: "800px",
        }}
      >

        {/* TIMER */}

        <div className="timer">
          Time Left: {formatTime()}
        </div>


        {/* TITLE */}

        <h1>
          Online Quiz
        </h1>


        {/* USERNAME */}

        <p>
          <strong>
            Candidate:
          </strong>{" "}
          {username}
        </p>


        {/* QUESTION NUMBER */}

        <p>
          Question{" "}
          {currentQuestion + 1} of{" "}
          {questions.length}
        </p>


        {/* QUESTION */}

        <h2>
          {question.question}
        </h2>


        {/* OPTIONS */}

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
                  ? "rgba(20,184,166,0.45)"
                  : "rgba(255,255,255,0.08)",
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
                  ? "rgba(20,184,166,0.45)"
                  : "rgba(255,255,255,0.08)",
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
                  ? "rgba(20,184,166,0.45)"
                  : "rgba(255,255,255,0.08)",
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
                  ? "rgba(20,184,166,0.45)"
                  : "rgba(255,255,255,0.08)",
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


        {/* NAVIGATION */}

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


        {/* ERROR MESSAGE */}

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