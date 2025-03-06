export interface Company {
  id: number;
  name: string;
  industry: string;
  revenue: number; // Consider using `bigint` for large revenue values if needed
  createdAt?: string; // Optional timestamp for when the company was added
  updatedAt?: string; // Optional timestamp for the last update
}
