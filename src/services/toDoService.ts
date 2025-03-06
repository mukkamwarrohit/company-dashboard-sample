import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { ToDo } from "../types/todo";

const TODOS_API = `${API_BASE_URL}/todos`;

// Utility Functions for Local Storage
const saveToLocalStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const getFromLocalStorage = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

// Fetch All To-Dos & Cache in Local Storage
const fetchTodos = async (): Promise<ToDo[]> => {
  const response = await axios.get<ToDo[]>(TODOS_API);
  saveToLocalStorage("todos", response.data); // ✅ Save to Local Storage
  return response.data;
};

// Hook: Fetch All To-Dos (Uses Local Storage First)
export const useTodos = () => {
  return useQuery<ToDo[]>({
    queryKey: ["todos"],
    queryFn: async () => {
      const localTodos = getFromLocalStorage<ToDo>("todos");
      return localTodos.length > 0 ? localTodos : fetchTodos();
    },
    initialData: getFromLocalStorage<ToDo>("todos"),
  });
};

// Hook: Create a New To-Do
export const useCreateTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (todo: Omit<ToDo, "id">) => {
      // ✅ Generate a unique ID if no API response
      const existingTodos = getFromLocalStorage<ToDo>("todos");
      const newId = existingTodos.length ? Math.max(...existingTodos.map((t) => t.id)) + 1 : 1;

      const newTodo = { id: newId, ...todo };

      try {
        const response = await axios.post(TODOS_API, todo);
        newTodo.id = response.data.id; // ✅ Ensure ID is set from API
      } catch (error) {
        console.warn("Using local ID for new To-Do (API failed)");
      }

      return newTodo;
    },
    onSuccess: (newTodo) => {
      const existingTodos = getFromLocalStorage<ToDo>("todos");
      const updatedTodos = [...existingTodos, newTodo];
      saveToLocalStorage("todos", updatedTodos);
      queryClient.setQueryData(["todos"], updatedTodos);
    },
  });
};

// Hook: Update a To-Do
export const useUpdateTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (todo: ToDo) => {
      await axios.put(`${TODOS_API}/${todo.id}`, todo);
      return todo;
    },
    onSuccess: (updatedTodo) => {
      const existingTodos = getFromLocalStorage<ToDo>("todos");
      const updatedTodos = existingTodos.map((todo) =>
        todo.id === updatedTodo.id ? updatedTodo : todo
      );
      saveToLocalStorage("todos", updatedTodos);
      queryClient.setQueryData(["todos"], updatedTodos);
    },
  });
};

// Hook: Delete a To-Do
export const useDeleteTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (todoId: number) => {
      await axios.delete(`${TODOS_API}/${todoId}`);
      return todoId;
    },
    onSuccess: (deletedTodoId) => {
      const existingTodos = getFromLocalStorage<ToDo>("todos");
      const updatedTodos = existingTodos.filter((todo) => todo.id !== deletedTodoId);
      saveToLocalStorage("todos", updatedTodos);
      queryClient.setQueryData(["todos"], updatedTodos);
    },
  });
};
