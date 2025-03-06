import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { BlogPost, Comment } from "../types/blog";

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
const fetchPosts = async (): Promise<BlogPost[]> => {
  const response = await axios.get<BlogPost[]>(POSTS_API);
  saveToLocalStorage("posts", response.data);
  return response.data;
};

// Hook: Fetch All Posts
export const usePosts = () => {
  return useQuery<BlogPost[]>({
    queryKey: ["posts"],
    queryFn: async () => {
      const localPosts = getFromLocalStorage<BlogPost>("posts");
      return localPosts.length > 0 ? localPosts : fetchPosts();
    },
    initialData: getFromLocalStorage<BlogPost>("posts"),
  });
};

// Fetch Single Blog Post
const fetchPost = async (postId: number): Promise<BlogPost> => {
  const response = await axios.get<BlogPost>(`${POSTS_API}/${postId}`);
  return response.data;
};

// Hook: Fetch Single Post
export const usePost = (postId: number) => {
  return useQuery<BlogPost | null>({
    queryKey: ["post", postId],
    queryFn: () => fetchPost(postId),
  });
};

// Fetch Comments & Cache in Local Storage
const fetchComments = async (postId: number): Promise<Comment[]> => {
  const response = await axios.get<Comment[]>(`${COMMENTS_API}?postId=${postId}`);
  const comments = response.data || []; // ✅ Ensure it's always an array
  saveToLocalStorage(`comments_${postId}`, comments);
  return comments;
};

// Hook: Fetch Comments
export const useComments = (postId: number) => {
  return useQuery<Comment[]>({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const localComments = getFromLocalStorage<Comment>(`comments_${postId}`);
      return Array.isArray(localComments) && localComments.length > 0 ? localComments : fetchComments(postId);
    },
    initialData: getFromLocalStorage<Comment>(`comments_${postId}`) || [], // ✅ Ensure default is an array
  });
};

// Hook: Add a New Comment
export const useAddComment = (postId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newComment: Omit<Comment, "id">) => {
      const existingComments = getFromLocalStorage<Comment>(`comments_${postId}`) || [];
      const newId = existingComments.length ? Math.max(...existingComments.map((c) => c.id)) + 1 : 1;
      const createdComment = { id: newId, postId, ...newComment };
      
      saveToLocalStorage(`comments_${postId}`, [...existingComments, createdComment]);
      return createdComment;
    },
    onSuccess: (newComment) => {
      queryClient.setQueryData(["comments", postId], (oldData: Comment[] = []) => [...oldData, newComment]);
    },
  });
};

// Hook: Delete a Comment
export const useDeleteComment = (postId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: number) => {
      const updatedComments = getFromLocalStorage<Comment>(`comments_${postId}`).filter(comment => comment.id !== commentId);
      saveToLocalStorage(`comments_${postId}`, updatedComments);
      return commentId;
    },
    onSuccess: (deletedCommentId) => {
      queryClient.setQueryData(["comments", postId], (oldData: Comment[] = []) =>
        oldData.filter((comment) => comment.id !== deletedCommentId)
      );
    },
  });
};

// Hook: Create a New Blog Post
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (post: Omit<BlogPost, "id">) => {
      const existingPosts = getFromLocalStorage<BlogPost>("posts");
      const newId = existingPosts.length ? Math.max(...existingPosts.map((p) => p.id)) + 1 : 1;
      const newPost = { id: newId, ...post };
      saveToLocalStorage("posts", [...existingPosts, newPost]);
      return newPost;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] }); // ✅ Fixed invalidateQueries
    },
  });
};

// Hook: Update a Blog Post
export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (post: BlogPost) => {
      const existingPosts = getFromLocalStorage<BlogPost>("posts");
      const updatedPosts = existingPosts.map((p) => (p.id === post.id ? post : p));
      saveToLocalStorage("posts", updatedPosts);
      return post;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] }); // ✅ Fixed invalidateQueries
    },
  });
};

// Hook: Delete a Blog Post
export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postId: number) => {
      const updatedPosts = getFromLocalStorage<BlogPost>("posts").filter((p) => p.id !== postId);
      saveToLocalStorage("posts", updatedPosts);
      return postId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] }); // ✅ Fixed invalidateQueries
    },
  });
};
