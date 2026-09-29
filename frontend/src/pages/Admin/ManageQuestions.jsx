import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ManageQuestions() {
  const [questions, setQuestions] = useState([]);
  const [message, setMessage] = useState("");

  const [editingQuestion, setEditingQuestion] = useState(null);

  const navigate = useNavigate();

  const BACKEND_URL = "https://quizz-mkkz.onrender.com";

  // Get all questions
  const fetchQuestions = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/questions/`
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.detail || "Failed to load questions."
        );
        return;
      }

      setQuestions(data);
    } catch (error) {
      console.error("Fetch questions error:", error);
      setMessage("Unable to connect to backend.");
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Delete question
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this question?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `${BACKEND_URL}/questions/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(
          "Question deleted successfully."
        );

        fetchQuestions();
      } else {
        setMessage(
          data.detail ||
            "Failed to delete question."
        );
      }
    } catch (error) {
      console.error("Delete question error:", error);
      setMessage("Unable to connect to backend.");
    }
  };

  // Start editing
  const handleEdit = (question) => {
    setEditingQuestion({
      ...question,
    });

    setMessage("");
  };

  // Save edited question
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${BACKEND_URL}/questions/${editingQuestion.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            question:
              editingQuestion.question,

            option1:
              editingQuestion.option1,

            option2:
              editingQuestion.option2,

            option3:
              editingQuestion.option3,

            option4:
              editingQuestion.option4,

            correct_answer:
              editingQuestion.correct_answer,

            category:
              editingQuestion.category,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(
          "Question updated successfully."
        );

        setEditingQuestion(null);

        fetchQuestions();
      } else {
        setMessage(
          data.detail ||
            "Failed to update question."
        );
      }
    } catch (error) {
      console.error("Update question error:", error);
      setMessage("Unable to connect to backend.");
    }
  };

  return (
    <div className="app-container">
      <div
        className="quiz-card"
        style={{ maxWidth: "900px" }}
      >

        <h1>Manage Questions</h1>

        {message && (
          <p style={{ color: "#fbbf24" }}>
            {message}
          </p>
        )}

        {/* EDIT FORM */}

        {editingQuestion && (
          <div
            style={{
              padding: "20px",
              marginBottom: "30px",
              borderRadius: "12px",
              background:
                "rgba(255,255,255,0.08)",
              border:
                "1px solid rgba(255,255,255,0.15)",
            }}
          >

            <h2>Edit Question</h2>

            <form onSubmit={handleUpdate}>

              <input
                type="text"
                value={
                  editingQuestion.question
                }
                onChange={(e) =>
                  setEditingQuestion({
                    ...editingQuestion,
                    question:
                      e.target.value,
                  })
                }
              />

              <br />
              <br />

              <input
                type="text"
                value={
                  editingQuestion.option1
                }
                onChange={(e) =>
                  setEditingQuestion({
                    ...editingQuestion,
                    option1:
                      e.target.value,
                  })
                }
              />

              <br />
              <br />

              <input
                type="text"
                value={
                  editingQuestion.option2
                }
                onChange={(e) =>
                  setEditingQuestion({
                    ...editingQuestion,
                    option2:
                      e.target.value,
                  })
                }
              />

              <br />
              <br />

              <input
                type="text"
                value={
                  editingQuestion.option3
                }
                onChange={(e) =>
                  setEditingQuestion({
                    ...editingQuestion,
                    option3:
                      e.target.value,
                  })
                }
              />

              <br />
              <br />

              <input
                type="text"
                value={
                  editingQuestion.option4
                }
                onChange={(e) =>
                  setEditingQuestion({
                    ...editingQuestion,
                    option4:
                      e.target.value,
                  })
                }
              />

              <br />
              <br />

              <input
                type="text"
                value={
                  editingQuestion.correct_answer
                }
                onChange={(e) =>
                  setEditingQuestion({
                    ...editingQuestion,
                    correct_answer:
                      e.target.value,
                  })
                }
              />

              <br />
              <br />

              <input
                type="text"
                value={
                  editingQuestion.category || ""
                }
                onChange={(e) =>
                  setEditingQuestion({
                    ...editingQuestion,
                    category:
                      e.target.value,
                  })
                }
              />

              <br />
              <br />

              <button type="submit">
                Update Question
              </button>

              <button
                type="button"
                style={{
                  marginLeft: "10px",
                }}
                onClick={() =>
                  setEditingQuestion(null)
                }
              >
                Cancel
              </button>

            </form>

          </div>
        )}

        {/* QUESTION LIST */}

        {questions.length === 0 ? (
          <p>No questions available.</p>
        ) : (
          questions.map((q, index) => (
            <div
              key={q.id}
              style={{
                marginTop: "20px",
                padding: "20px",
                borderRadius: "12px",
                background:
                  "rgba(255,255,255,0.08)",
                border:
                  "1px solid rgba(255,255,255,0.15)",
              }}
            >

              <h3>
                {index + 1}. {q.question}
              </h3>

              <p>
                Option 1: {q.option1}
              </p>

              <p>
                Option 2: {q.option2}
              </p>

              <p>
                Option 3: {q.option3}
              </p>

              <p>
                Option 4: {q.option4}
              </p>

              <p>
                <strong>
                  Correct Answer:
                </strong>{" "}
                {q.correct_answer}
              </p>

              <p>
                <strong>
                  Category:
                </strong>{" "}
                {q.category}
              </p>

              <button
                onClick={() =>
                  handleEdit(q)
                }
              >
                Edit
              </button>

              <button
                style={{
                  marginLeft: "10px",
                }}
                onClick={() =>
                  handleDelete(q.id)
                }
              >
                Delete
              </button>

            </div>
          ))
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

export default ManageQuestions;