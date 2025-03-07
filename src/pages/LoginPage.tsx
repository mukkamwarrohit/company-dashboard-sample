import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, Typography, Alert } from "antd";
import { useAuthStore } from "../store/authStore";

// Mock users for login simulation
const mockUsers = [
  { email: "admin@example.com", password: "admin123", role: "admin" },
  { email: "editor@example.com", password: "editor123", role: "editor" },
  { email: "viewer@example.com", password: "viewer123", role: "viewer" },
];

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: { email: string; password: string }) => {
    setLoading(true);
    setError(null);

    // Check if user exists in mock data
    const user = mockUsers.find(
      (u) => u.email === values.email && u.password === values.password
    );

    if (!user) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    // Simulate API token response
    const token = "mock-jwt-token";

    // Store user session
    login(token, { id: 1, name: user.email, role: user.role });

    // Redirect to dashboard
    navigate("/");
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f5f5f5" }}>
      <Card style={{ width: 400, padding: 20, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}>
        <Typography.Title level={2} style={{ textAlign: "center" }}>Login</Typography.Title>
        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 10 }} />}
        <Form onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" }
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true, message: "Please enter your password" }]}>
            <Input.Password placeholder="Enter your password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
