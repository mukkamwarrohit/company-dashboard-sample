import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import UsersPage from "./pages/UsersPage";
import CompaniesPage from "./pages/CompaniesPage";
import BlogPage from "./pages/BlogPage";
import BlogDetailsPage from "./pages/BlogDetailsPage";
import ToDoPage from "./pages/ToDoPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute"; 
const App = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes (Inside Dashboard Layout) */}
      <Route
        path="/"
        element={
          <ProtectedRoute requiredRoles={["admin", "editor", "viewer"]}>
            <DashboardLayout>
              <Outlet />
            </DashboardLayout>
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route
          path="users"
          element={
            <ProtectedRoute requiredRoles={["admin"]}>
              <UsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="companies"
          element={
            <ProtectedRoute requiredRoles={["admin", "editor"]}>
              <CompaniesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="blog"
          element={
            <ProtectedRoute requiredRoles={["admin", "editor"]}>
              <BlogPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="blog/:postId"
          element={
            <ProtectedRoute requiredRoles={["admin", "editor", "viewer"]}>
              <BlogDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="todos"
          element={
            <ProtectedRoute requiredRoles={["admin", "editor", "viewer"]}>
              <ToDoPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Redirect unknown routes to Dashboard */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
