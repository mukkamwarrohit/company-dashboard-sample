import { useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Spin, Alert, Card, List, Modal, Input, Button, Popconfirm } from "antd";
import { usePost, useComments, useAddComment, useDeleteComment } from "../services/blogService";
import { Post, Comment } from "../types/blog";

const BlogDetailsPage = () => {
  const { postId } = useParams<{ postId: string }>();
  const { data: post, isLoading: postLoading, isError: postError } = usePost(postId);
  const { data: comments = [], isLoading: commentsLoading, isError: commentsError } = useComments(postId);
  const { mutate: addComment } = useAddComment(postId);
  const { mutate: deleteComment } = useDeleteComment(postId);

  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [newComment, setNewComment] = useState({ name: "", email: "", body: "" });

  const handleAddComment = () => {
    if (!newComment.name || !newComment.email || !newComment.body) return;
    addComment({ ...newComment, postId: Number(postId) });
    setNewComment({ name: "", email: "", body: "" });
  };

  return (
    <div style={{ padding: "20px" }}>
      {postLoading ? (
        <Spin size="large" />
      ) : postError ? (
        <Alert message="Error loading post!" type="error" showIcon />
      ) : (
        <Card title={post?.title} style={{ marginBottom: "20px" }}>
          <Typography.Paragraph>{post?.body}</Typography.Paragraph>
        </Card>
      )}

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

      {/* Comment List */}
      {commentsLoading ? (
        <Spin size="large" />
      ) : commentsError ? (
        <Alert message="Error loading comments!" type="error" showIcon />
      ) : (
        <List
          bordered
          dataSource={Array.isArray(comments) ? comments : []} // ✅ Ensure it's an array
          renderItem={(comment: Comment) => (
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
              onClick={() => { setSelectedComment(comment); setIsCommentModalOpen(true); }} 
              style={{ cursor: "pointer" }}
            >
              <Typography.Text strong>{comment.name}</Typography.Text>
            </List.Item>
          )}
        />
      )}

      {/* Comment Details Modal */}
      <Modal open={isCommentModalOpen} onCancel={() => setIsCommentModalOpen(false)} footer={null}>
        {selectedComment ? (
          <>
            <Typography.Title level={4}>{selectedComment.name}</Typography.Title>
            <Typography.Text type="secondary">{selectedComment.email}</Typography.Text>
            <Typography.Paragraph>{selectedComment.body}</Typography.Paragraph>
          </>
        ) : null}
      </Modal>
    </div>
  );
};

export default BlogDetailsPage;
