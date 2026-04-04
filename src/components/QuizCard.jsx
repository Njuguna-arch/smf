import React from "react";

const QuizCard = ({ quiz, selectedOption, onSelect }) => {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "1rem",
        marginBottom: "1rem",
        backgroundColor: "#fdfdfd",
      }}
    >
      <h4>{quiz.subject} — Grade {quiz.grade}</h4>
      <p><strong>Question:</strong> {quiz.question}</p>

      <div>
        {quiz.options.map((option, idx) => (
          <label key={idx} style={{ display: "block", marginBottom: "0.5rem" }}>
            <input
              type="radio"
              name={quiz._id}
              value={option}
              checked={selectedOption === option}
              onChange={() => onSelect(quiz._id, option)}
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
};

export default QuizCard;