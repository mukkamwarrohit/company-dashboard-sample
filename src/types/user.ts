export interface User {
  id: number;
  name: string;
  email: string;
  company_id: number; // 🔗 Foreign key linking to Company
  role?: string; // Optional user role (e.g., "admin", "employee")
  createdAt?: string; // Optional timestamp for when the user was added
  updatedAt?: string; // Optional timestamp for the last update
}
