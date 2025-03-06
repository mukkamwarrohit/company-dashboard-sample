import { useState } from "react";
import { Typography, Button, Spin, Alert, List, Space, Popconfirm } from "antd";
import { useNavigate } from "react-router-dom";
import { usePosts, useCreatePost, useUpdatePost, useDeletePost } from "../services/blogService";
import BlogForm from "../components/blog/BlogForm";
import { BlogPost } from "../types/blog";

const BlogPage = () => {
  const { data: posts = [], isLoading, isError } = usePosts();
  const { mutate: createPost } = useCreatePost();
  const { mutate: updatePost } = useUpdatePost();
  const { mutate: deletePost } = useDeletePost();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const handleAddPost = () => {
    setEditingPost(null);
    setIsModalOpen(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setIsModalOpen(true);
  };

  const handleSubmit = (post: Omit<BlogPost, "id">) => {
    if (editingPost) {
      updatePost({ id: editingPost.id, ...post });
    } else {
      createPost(post);
    }
    setIsModalOpen(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography.Title level={2}>Blog Posts</Typography.Title>
      <Button type="primary" onClick={handleAddPost} style={{ marginBottom: "16px" }}>
        Add New Blog Post
      </Button>

      {isLoading ? (
        <Spin size="large" style={{ display: "block", textAlign: "center", marginTop: "20px" }} />
      ) : isError ? (
        <Alert message="Error loading posts!" type="error" showIcon />
      ) : (
        <List
          bordered
          dataSource={posts}
          renderItem={(post) => (
            <List.Item>
              <Space direction="vertical" style={{ width: "100%" }}>
                <Typography.Title
                  level={4}
                  style={{ cursor: "pointer", color: "blue" }}
                  onClick={() => navigate(`/blog/${post.id}`)}
                >
                  {post.title}
                </Typography.Title>
                <Typography.Paragraph>{post.body}</Typography.Paragraph>
                <Space>
                  <Button onClick={() => handleEditPost(post)}>Edit</Button>
                  <Popconfirm title="Are you sure you want to delete this post?" onConfirm={() => deletePost(post.id)}>
                    <Button danger>Delete</Button>
                  </Popconfirm>
                </Space>
              </Space>
            </List.Item>
          )}
        />
      )}

      <BlogForm visible={isModalOpen} onCancel={() => setIsModalOpen(false)} onSubmit={handleSubmit} initialValues={editingPost} />
    </div>
  );
};

export default BlogPage;