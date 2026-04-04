import React, { useState } from "react";
import axios from "axios";
import StudentSelector from "../components/StudentSelector.jsx";

const StudentQuizzesPage = () => {
  const [studentId, setStudentId] = useState("");
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchQuizzes = async (id) => {
    if (!id) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/teacher/${id}/completed-quizzes`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQuizzes(res.data);
    } catch (err) {
      console.error("Error fetching completed quizzes:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Completed Quizzes</h2>

      <StudentSelector
        onSelect={(id) => {
          setStudentId(id);
          fetchQuizzes(id);
        }}
      />

      {loading ? (
        <p>Loading...</p>
      ) : quizzes.length === 0 ? (
        <p>No quizzes completed yet.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "1rem",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Subject
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Grade
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Question
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Score
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Total
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Attempted At
              </th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((q, idx) => (
              <tr key={idx}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {q.quiz?.subject}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {q.quiz?.grade}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {q.quiz?.question}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {q.score}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {q.total}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {new Date(q.attemptedAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentQuizzesPage;