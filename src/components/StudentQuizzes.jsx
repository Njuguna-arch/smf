import React, { useState, useEffect } from "react";
import axios from "axios";

const StudentQuizzes = ({ studentId }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/teacher/${studentId}/completed-quizzes`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setQuizzes(res.data);
      } catch (err) {
        console.error("Error fetching completed quizzes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, [studentId]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Completed Quizzes</h2>
      {quizzes.length === 0 ? (
        <p>No quizzes completed yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Grade</th>
              <th>Question</th>
              <th>Score</th>
              <th>Total</th>
              <th>Attempted At</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((q, idx) => (
              <tr key={idx}>
                <td>{q.quiz?.subject}</td>
                <td>{q.quiz?.grade}</td>
                <td>{q.quiz?.question}</td>
                <td>{q.score}</td>
                <td>{q.total}</td>
                <td>{new Date(q.attemptedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentQuizzes;