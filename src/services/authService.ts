import axios from "axios";
import { API_BASE_URL } from "../config";

const LOGIN_API = `${API_BASE_URL}/login`;

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(LOGIN_API, { email, password });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || "Invalid credentials");
    }
    throw new Error("Network error. Please try again.");
  }
};
