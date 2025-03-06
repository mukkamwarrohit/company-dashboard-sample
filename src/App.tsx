import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import UsersPage from "./pages/UsersPage";
import CompaniesPage from "./pages/CompaniesPage";
import BlogPage from "./pages/BlogPage";
import BlogDetailsPage from "./pages/BlogDetailsPage";
import ToDoPage from "./pages/ToDoPage";
import LoginPage from "./pages/LoginPage";

const App = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes (Inside Dashboard Layout) */}
      <Route path="/" element={<DashboardLayout> <Outlet /> </DashboardLayout>}>
        <Route index element={<DashboardPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="companies" element={<CompaniesPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/:postId" element={<BlogDetailsPage />} />
        <Route path="todos" element={<ToDoPage />} />
      </Route>

      {/* Redirect unknown routes to Dashboard */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
