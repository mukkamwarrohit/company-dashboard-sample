import { Typography, Spin, Alert, List } from "antd";
import { usePosts } from "../services/blogService"; // ✅ Now correctly imported
import { useNavigate } from "react-router-dom";
import { Post } from "../types/blog";

const BlogPage = () => {
  const { data: posts = [], isLoading, isError } = usePosts();
  const navigate = useNavigate();

  return (
    <div style={{ padding: "20px" }}>
      <Typography.Title level={2}>Blog Posts</Typography.Title>

      {isLoading ? (
        <Spin size="large" style={{ display: "block", textAlign: "center", marginTop: "20px" }} />
      ) : isError ? (
        <Alert message="Error loading posts!" type="error" showIcon />
      ) : (
        <List
          bordered
          dataSource={posts}
          renderItem={(post: Post) => (
            <List.Item onClick={() => navigate(`/blog/${post.id}`)} style={{ cursor: "pointer" }}>
              <Typography.Text strong>{post.title}</Typography.Text>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default BlogPage;
