import React, { useState, useEffect } from "react";
import { fetchQuizzes, submitQuiz } from "../services/quizService";
import QuizCard from "./QuizCard";

const QuizList = ({ grade, subject }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadQuizzes();
  }, [grade, subject]);

  const loadQuizzes = async () => {
    setLoading(true);
    try {
      const data = await fetchQuizzes(grade, subject);
      setQuizzes(data);
    } catch (err) {
      console.error(" Error loading quizzes:", err.message);
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (quizId, option) => {
    setSelectedOptions((prev) => ({ ...prev, [quizId]: option }));
  };

  const handleSubmit = async () => {
    const answers = quizzes.map((quiz) => ({
      questionId: quiz._id,
      selectedOption: selectedOptions[quiz._id],
    }));

    try {
      const result = await submitQuiz(answers);
      setScore(result);

      // Reload quizzes after submission so completed ones disappear
      await loadQuizzes();
    } catch (err) {
      console.error("Error submitting quiz:", err.message);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Quizzes</h2>

      {loading && <p>Loading quizzes...</p>}
      {!loading && quizzes.length === 0 && <p>No quizzes available.</p>}

      {quizzes.map((quiz) => (
        <QuizCard
          key={quiz._id}
          quiz={quiz}
          selectedOption={selectedOptions[quiz._id]}
          onSelect={handleSelect}
        />
      ))}

      {quizzes.length > 0 && (
        <button
          onClick={handleSubmit}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            marginTop: "1rem",
          }}
        >
          Submit Quiz
        </button>
      )}

      {score && (
        <p style={{ marginTop: "1rem" }}>
          Your Score: {score.score}/{score.total}
        </p>
      )}
    </div>
  );
};

export default QuizList;