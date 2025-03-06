import { Layout, Menu, Typography, Switch } from "antd";
import { UserOutlined, HomeOutlined, BankOutlined, FileTextOutlined, CheckCircleOutlined, LogoutOutlined, MoonOutlined, SunOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const { Header, Sider, Content, Footer } = Layout;

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    document.body.setAttribute("data-theme", darkMode ? "dark" : "light");
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { key: "1", icon: <HomeOutlined />, label: "Dashboard", onClick: () => navigate("/") },
    { key: "2", icon: <UserOutlined />, label: "Users", onClick: () => navigate("/users") },
    { key: "3", icon: <BankOutlined />, label: "Companies", onClick: () => navigate("/companies") },
    { key: "4", icon: <FileTextOutlined />, label: "Blog", onClick: () => navigate("/blog") },
    { key: "5", icon: <CheckCircleOutlined />, label: "To-Do", onClick: () => navigate("/todos") },
    { key: "6", icon: <LogoutOutlined />, label: "Logout", onClick: handleLogout },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} theme={darkMode ? "dark" : "light"}>
        <Menu theme={darkMode ? "dark" : "light"} mode="inline" items={menuItems} />
      </Sider>
      <Layout>
        <Header
          style={{
            background: darkMode ? "#141414" : "#fff",
            padding: "0 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography.Title level={3} style={{ margin: 0, color: darkMode ? "#fff" : "#000" }}>
            Admin Dashboard
          </Typography.Title>
          <Switch
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<SunOutlined />}
          />
        </Header>
        <Content
          style={{
            margin: "16px",
            padding: "20px",
            background: darkMode ? "#1c1c1c" : "#fff",
            color: darkMode ? "#fff" : "#000",
            minHeight: "80vh",
            borderRadius: 8,
          }}
        >
          {children}
        </Content>
        <Footer
          style={{
            textAlign: "center",
            background: darkMode ? "#141414" : "#fff",
            color: darkMode ? "#fff" : "#000",
          }}
        >
          Ant Design Dashboard ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;