import { useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Spin, Alert, Card, List, Input, Button, Popconfirm, notification } from "antd";
import { usePost, useComments, useAddComment, useDeleteComment } from "../services/blogService";
import { Comment } from "../types/blog";
import { showNotification } from "../utils/Notifications";

const BlogDetailsPage = () => {
  const { postId } = useParams<{ postId: string }>();
  const numericPostId = Number(postId);
  
  const { data: post, isLoading: postLoading, isError: postError } = usePost(numericPostId);
  const { data: comments = [], isLoading: commentsLoading, isError: commentsError } = useComments(numericPostId);
  const { mutate: addComment } = useAddComment(numericPostId);
  const { mutate: deleteComment } = useDeleteComment(numericPostId);

  const [newComment, setNewComment] = useState({ name: "", email: "", body: "" });

  const showNotification = (type: "success" | "error" | "info", message: string, description?: string) => {
    notification[type]({
      message,
      description,
      placement: "topRight",
    });
  };

  const handleAddComment = () => {
    if (!newComment.name || !newComment.email || !newComment.body) return;
    addComment({ ...newComment, postId: numericPostId });
    setNewComment({ name: "", email: "", body: "" });
    showNotification("success", "Comment Added", "Your comment has been successfully posted.");
  };

  if (postLoading) return <Spin size="large" />;
  if (postError || !post) return <Alert message="Error loading post or post not found!" type="error" showIcon />;

  return (
    <div style={{ padding: "20px" }}>
      <Typography.Title level={2}>{post.title}</Typography.Title>
      <Card title={post.title} style={{ marginBottom: "20px" }}>
        <Typography.Paragraph>{post.body}</Typography.Paragraph>
      </Card>
      <Typography.Title level={3}>Comments</Typography.Title>
      <Input
        placeholder="Your Name"
        value={newComment.name}
        onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
        style={{ marginBottom: "10px" }}
      />
      <Input
        placeholder="Your Email"
        value={newComment.email}
        onChange={(e) => setNewComment({ ...newComment, email: e.target.value })}
        style={{ marginBottom: "10px" }}
      />
      <Input.TextArea
        placeholder="Write a comment..."
        value={newComment.body}
        onChange={(e) => setNewComment({ ...newComment, body: e.target.value })}
        rows={3}
        style={{ marginBottom: "10px" }}
      />
      <Button type="primary" onClick={handleAddComment}>Add Comment</Button>
      {commentsLoading ? (
        <Spin size="large" />
      ) : commentsError || !Array.isArray(comments) ? (
        <Alert message="Error loading comments!" type="error" showIcon />
      ) : (
        <List
          bordered
          dataSource={comments}
          renderItem={(comment) => (
            <List.Item
              actions={[
                <Popconfirm
                  title="Are you sure you want to delete this comment?"
                  onConfirm={() => {
                    deleteComment(comment.id);
                    showNotification("success", "Comment Deleted", "The comment has been removed.");
                  }}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button danger size="small">Delete</Button>
                </Popconfirm>
              ]}
            >
              <Typography.Text strong>{comment.name}</Typography.Text>
              <Typography.Paragraph>{comment.body}</Typography.Paragraph>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default BlogDetailsPage;
