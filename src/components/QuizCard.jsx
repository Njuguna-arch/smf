import React from "react";

const QuizCard = ({ quiz, answers, onSelect, result }) => {
  return (
    <div style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "1rem", marginBottom: "1rem" }}>
      <h4>{quiz.subject} — Grade {quiz.grade}</h4>
      <p><strong>Question:</strong> {quiz.question}</p>

      <div>
        {quiz.options?.map((option, idx) => {
          const selected = answers[quiz._id] === option;

          // Feedback after submission
          const feedback = result?.answers?.find((a) => a.quizId === quiz._id);

          let bgColor = "transparent";
          if (feedback) {
            if (option === feedback.selectedOption) {
              bgColor = feedback.isCorrect ? "#d4edda" : "#f8d7da"; // green/red
            }
            if (!feedback.isCorrect && option === feedback.correctAnswer) {
              bgColor = "#d1ecf1"; // blue highlight for correct answer
            }
          }

          return (
            <label
              key={idx}
              style={{
                display: "block",
                marginBottom: "0.5rem",
                backgroundColor: bgColor,
                padding: "0.25rem",
                borderRadius: "4px",
              }}
            >
              <input
                type="radio"
                name={quiz._id}
                value={option}
                checked={selected}
                onChange={() => onSelect(quiz._id, option)}
                disabled={!!feedback} // lock after submission
              />
              {option}
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default QuizCard;
