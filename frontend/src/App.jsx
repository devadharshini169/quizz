import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

// Home
import Home from "./pages/Home";

// Admin Pages
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import CreateQuestion from "./pages/Admin/CreateQuestion";
import ManageQuestions from "./pages/Admin/ManageQuestions";
import Results from "./pages/Admin/Results";

// User Pages
import UserHome from "./pages/User/UserHome";
import Quiz from "./pages/User/Quiz";
import Result from "./pages/User/Result";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Home Page */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* Admin Login */}
        <Route
          path="/admin"
          element={<AdminLogin />}
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        {/* Create Question */}
        <Route
          path="/admin/create-question"
          element={<CreateQuestion />}
        />

        {/* Manage Questions */}
        <Route
          path="/admin/questions"
          element={<ManageQuestions />}
        />

        {/* View Results */}
        <Route
          path="/admin/results"
          element={<Results />}
        />

        {/* User Home */}
        <Route
          path="/user"
          element={<UserHome />}
        />

        {/* Quiz */}
        <Route
          path="/quiz"
          element={<Quiz />}
        />

        {/* Quiz Result */}
        <Route
          path="/result"
          element={<Result />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;