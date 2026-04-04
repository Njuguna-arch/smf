import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./context/UserContext";

// Layouts
import StudentLayout from "./layouts/StudentLayout";
import TeacherLayout from "./layouts/TeacherLayout";
import AdminLayout from "./layouts/AdminLayout";

// Pages
import LoginPage from "./pages/LoginPage";
import Profile from "./pages/Profile";
import Quizzes from "./pages/Quizzes";
import Videos from "./pages/Videos";
import StudentDiscipline from "./pages/StudentDiscipline";
import StudentExamResults from "./pages/StudentExamResults";
import StudentQuizzesPage from "./pages/StudentQuizzesPage";
import StudentAnnouncements from "./pages/StudentAnnouncements";

import TeacherDashboard from "./pages/TeacherDashboard";
import TeacherExamResults from "./pages/TeacherExamResults";
import TeacherDiscipline from "./pages/TeacherDiscipline";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import ManageUsers from "./pages/ManageUsers";
import Announcements from "./pages/Announcements";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import TeacherUploadVideo from "./components/TeacherUploadVideo";
import AddQuizForm from "./components/AddQuizForm";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Student routes */}
          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<Navigate to="profile" replace />} />

            <Route
              path="profile"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="quizzes"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <Quizzes />
                </ProtectedRoute>
              }
            />
            <Route
              path="exam-results"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentExamResults />
                </ProtectedRoute>
              }
            />
            <Route
              path="videos"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <Videos />
                </ProtectedRoute>
              }
            />
            <Route
              path="discipline"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentDiscipline />
                </ProtectedRoute>
              }
            />
            <Route
              path="announcements"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentAnnouncements />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Teacher routes */}
          <Route path="/teacher" element={<TeacherLayout />}>
            <Route
              index
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <TeacherDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="exams"
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <TeacherExamResults />
                </ProtectedRoute>
              }
            />
            <Route
              path="discipline"
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <TeacherDiscipline />
                </ProtectedRoute>
              }
            />
            <Route
              path="videos/upload"
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <TeacherUploadVideo />
                </ProtectedRoute>
              }
            />
            <Route
              path="quizzes/add"
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <AddQuizForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="quizzes"
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <StudentQuizzesPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route
              path="dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="users"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <ManageUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="announcements"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Announcements />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Fallback */}
          <Route
            path="*"
            element={<h2 style={{ padding: "2rem" }}>404 - Page Not Found</h2>}
          />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;