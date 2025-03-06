import { useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Spin, Alert, Card, List, Modal, Input, Button, Popconfirm } from "antd";
import { usePost, useComments, useAddComment, useDeleteComment } from "../services/blogService";
import { Comment } from "../types/blog";

const BlogDetailsPage = () => {
  const { postId } = useParams<{ postId: string }>();
  const numericPostId = Number(postId); // ✅ Convert to number
  const { data: post, isLoading: postLoading, isError: postError } = usePost(numericPostId);
  const { data: comments = [], isLoading: commentsLoading, isError: commentsError } = useComments(numericPostId);
  const { mutate: addComment } = useAddComment(numericPostId);
  const { mutate: deleteComment } = useDeleteComment(numericPostId);

  const [newComment, setNewComment] = useState({ name: "", email: "", body: "" });

  const handleAddComment = () => {
    if (!newComment.name || !newComment.email || !newComment.body) return;
    addComment({ ...newComment, postId: numericPostId });
    setNewComment({ name: "", email: "", body: "" });
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* ✅ Fix: Ensure post is loading properly */}
      {postLoading ? (
        <Spin size="large" />
      ) : postError || !post ? (
        <Alert message="Error loading post or post not found!" type="error" showIcon />
      ) : (
        <Card title={post.title} style={{ marginBottom: "20px" }}>
          <Typography.Paragraph>{post.body}</Typography.Paragraph>
        </Card>
      )}

      {/* Comments Section */}
      <Typography.Title level={3}>Comments</Typography.Title>

      {/* Add Comment Form */}
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

      {/* ✅ Fix: Ensure comments load properly */}
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
                  onConfirm={() => deleteComment(comment.id)}
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
