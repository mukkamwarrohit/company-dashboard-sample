import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { User } from "../types/user";

const USERS_API = `${API_BASE_URL}/users`;

const saveToLocalStorage = (users: User[]) => {
  localStorage.setItem("users", JSON.stringify(users));
};

const getFromLocalStorage = (): User[] => {
  const data = localStorage.getItem("users");
  return data ? JSON.parse(data) : [];
};

// Fetch Users and Save to Local Storage
const fetchUsers = async (): Promise<User[]> => {
  const response = await axios.get(USERS_API);
  const users = response.data;
  saveToLocalStorage(users);
  return users;
};

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const localData = getFromLocalStorage();
      return localData.length > 0 ? localData : fetchUsers();
    },
  });
};

// Create User and Save to Local Storage
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user: Omit<User, "id">) => {
      const newUser = { ...user, id: Date.now() }; // Fake ID for local storage
      const updatedUsers = [...getFromLocalStorage(), newUser];
      saveToLocalStorage(updatedUsers);
      return newUser;
    },
    onSuccess: (newUser) => {
      queryClient.setQueryData(["users"], (oldUsers: User[] = []) => [...oldUsers, newUser]);
    },
  });
};

// Update User in Local Storage
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updatedUser: User) => {
      const updatedUsers = getFromLocalStorage().map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      );
      saveToLocalStorage(updatedUsers);
      return updatedUser;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["users"], (oldUsers: User[] = []) =>
        oldUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      );
    },
  });
};

// Delete User from Local Storage
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: number) => {
      const updatedUsers = getFromLocalStorage().filter((user) => user.id !== userId);
      saveToLocalStorage(updatedUsers);
      return userId;
    },
    onSuccess: (deletedUserId) => {
      queryClient.setQueryData(["users"], (oldUsers: User[] = []) =>
        oldUsers.filter((user) => user.id !== deletedUserId)
      );
    },
  });
};
