import { Typography, Card } from "antd";

const DashboardPage: React.FC = () => {
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <Card style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
        <Typography.Title level={2}>Welcome to the Dashboard</Typography.Title>
        <Typography.Paragraph>
          Manage users, companies, blog posts, and tasks efficiently.
        </Typography.Paragraph>
      </Card>
    </div>
  );
};

export default DashboardPage;