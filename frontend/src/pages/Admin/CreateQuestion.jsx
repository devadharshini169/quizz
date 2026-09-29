import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateQuestion() {
  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [option3, setOption3] = useState("");
  const [option4, setOption4] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !question ||
      !option1 ||
      !option2 ||
      !option3 ||
      !option4 ||
      !correctAnswer ||
      !category
    ) {
      setMessage("Please fill all fields.");
      return;
    }

    try {
      const response = await fetch(
        "https://quizz-mkkz.onrender.com/questions/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: question,
            option1: option1,
            option2: option2,
            option3: option3,
            option4: option4,
            correct_answer: correctAnswer,
            category: category,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Question created successfully!");

        setQuestion("");
        setOption1("");
        setOption2("");
        setOption3("");
        setOption4("");
        setCorrectAnswer("");
        setCategory("");
      } else {
        setMessage(
          data.detail || "Failed to create question."
        );
      }
    } catch (error) {
      console.error("Create question error:", error);
      setMessage("Unable to connect to backend.");
    }
  };

  return (
    <div className="app-container">
      <div className="quiz-card">

        <h1>Create Question</h1>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Enter question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          <br />
          <br />

          <input
            type="text"
            placeholder="Option 1"
            value={option1}
            onChange={(e) => setOption1(e.target.value)}
          />

          <br />
          <br />

          <input
            type="text"
            placeholder="Option 2"
            value={option2}
            onChange={(e) => setOption2(e.target.value)}
          />

          <br />
          <br />

          <input
            type="text"
            placeholder="Option 3"
            value={option3}
            onChange={(e) => setOption3(e.target.value)}
          />

          <br />
          <br />

          <input
            type="text"
            placeholder="Option 4"
            value={option4}
            onChange={(e) => setOption4(e.target.value)}
          />

          <br />
          <br />

          <select
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            style={{
              width: "100%",
              padding: "13px",
              borderRadius: "10px",
              fontSize: "16px",
            }}
          >
            <option value="">
              Select Correct Answer
            </option>

            <option value={option1}>
              Option 1
            </option>

            <option value={option2}>
              Option 2
            </option>

            <option value={option3}>
              Option 3
            </option>

            <option value={option4}>
              Option 4
            </option>
          </select>

          <br />
          <br />

          <input
            type="text"
            placeholder="Category (Example: Python)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <br />
          <br />

          <button type="submit">
            Save Question
          </button>

        </form>

        {message && (
          <p style={{ color: "#fbbf24" }}>
            {message}
          </p>
        )}

        <br />

        <button
          onClick={() =>
            navigate("/admin/dashboard")
          }
        >
          Back to Dashboard
        </button>

      </div>
    </div>
  );
}

export default CreateQuestion;