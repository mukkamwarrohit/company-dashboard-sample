import { Typography, Card } from "antd";
import { useAuthStore } from "../store/authStore";

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <Card style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
        <Typography.Title level={2}>Welcome to the Dashboard</Typography.Title>
        <Typography.Paragraph>
          Manage users, companies, blog posts, and tasks efficiently.
        </Typography.Paragraph>

        {/* Show additional UI based on role */}
        {user?.role === "admin" && <p>🔹 You have full admin access.</p>}
        {user?.role === "editor" && <p>✏️ You can edit content.</p>}
        {user?.role === "viewer" && <p>👀 View-only access.</p>}
      </Card>
    </div>
  );
};

export default DashboardPage;
