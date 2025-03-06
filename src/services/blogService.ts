import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { Post, Comment } from "../types/blog";

const POSTS_API = `${API_BASE_URL}/posts`;
const COMMENTS_API = `${API_BASE_URL}/comments`;

// Utility Functions for Local Storage
const saveToLocalStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const getFromLocalStorage = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

// Fetch All Blog Posts & Cache in Local Storage
const fetchPosts = async (): Promise<Post[]> => {
  const response = await axios.get<Post[]>(POSTS_API);
  saveToLocalStorage("posts", response.data);
  return response.data;
};

// Hook: Fetch All Posts
export const usePosts = () => {
  return useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: async () => {
      const localPosts = getFromLocalStorage<Post>("posts");
      return localPosts.length > 0 ? localPosts : fetchPosts();
    },
    initialData: getFromLocalStorage<Post>("posts"),
  });
};

// Fetch Single Blog Post
const fetchPost = async (postId: string): Promise<Post> => {
  const response = await axios.get<Post>(`${POSTS_API}/${postId}`);
  return response.data;
};

// Hook: Fetch Single Post
export const usePost = (postId: string) => {
  return useQuery<Post>({
    queryKey: ["post", postId],
    queryFn: () => fetchPost(postId),
  });
};

// Fetch Comments & Cache in Local Storage
const fetchComments = async (postId: string): Promise<Comment[]> => {
  const response = await axios.get<Comment[]>(`${COMMENTS_API}?postId=${postId}`);
  const comments = response.data || []; // ✅ Ensure it's always an array
  saveToLocalStorage(`comments_${postId}`, comments);
  return comments;
};

// Hook: Fetch Comments
export const useComments = (postId: string) => {
  return useQuery<Comment[]>({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const localComments = getFromLocalStorage<Comment>(`comments_${postId}`);
      return Array.isArray(localComments) && localComments.length > 0 ? localComments : fetchComments(postId);
    },
    initialData: getFromLocalStorage<Comment>(`comments_${postId}`) || [], // ✅ Ensure default is an array
  });
};


// Add Comment API Call
const postComment = async (postId: string, newComment: Omit<Comment, "id">) => {
  const response = await axios.post<Comment>(COMMENTS_API, { ...newComment, postId });
  return response.data;
};

// Hook: Add a New Comment
export const useAddComment = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newComment: Omit<Comment, "id">) => {
      const response = await axios.post<Comment>(COMMENTS_API, { ...newComment, postId });
      return response.data;
    },
    onSuccess: (newComment) => {
      const existingComments = getFromLocalStorage<Comment>(`comments_${postId}`) || []; // ✅ Always use an array
      const updatedComments = [...existingComments, newComment];
      saveToLocalStorage(`comments_${postId}`, updatedComments);
      queryClient.setQueryData(["comments", postId], updatedComments);
    },
  });
};

// Delete Comment API Call
const deleteCommentApi = async (commentId: number) => {
  await axios.delete(`${COMMENTS_API}/${commentId}`);
  return commentId;
};

// Hook: Delete a Comment
export const useDeleteComment = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCommentApi,
    onSuccess: (deletedCommentId) => {
      const existingComments = getFromLocalStorage<Comment>(`comments_${postId}`);
      const updatedComments = existingComments.filter(comment => comment.id !== deletedCommentId);
      saveToLocalStorage(`comments_${postId}`, updatedComments);
      queryClient.setQueryData(["comments", postId], updatedComments);
    },
  });
};
