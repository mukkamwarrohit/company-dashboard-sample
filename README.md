# Company & User Management Dashboard

## 📌 Project Overview
This project is a **React-based Admin Dashboard** for managing companies, users, roles, posts, and comments. It uses **React, Vite, TypeScript, Zustand, React Query, Ant Design, and Axios** for efficient state management and API interactions.

## 🚀 Features Implemented
- **User Authentication** (Login system with mock API & role-based access)
- **Dashboard Overview** (Shows statistics for users, companies, roles, and posts)
- **User Management** (CRUD operations for users with role-based restrictions)
- **Company Management** (List and filter companies with CRUD operations)
- **Blog & Comments System** (Users can create, edit, and delete posts & comments)
- **Protected Routes** (Restrict pages based on roles)
- **State Management** (Zustand for global state, React Query for data fetching)

## 🛠️ Installation & Setup
### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/your-repo/company-dashboard.git
cd company-dashboard
```

### **2️⃣ Install Dependencies**
```sh
npm install
```

### **3️⃣ Start the Development Server**
```sh
npm run dev
```

## 🔐 Mock User Credentials (For Testing Login)
| Role  | Email               | Password   |
|--------|----------------------|------------|
| **Admin**  | `admin@example.com`  | `admin123`  |
| **Editor**  | `editor@example.com`  | `editor123`  |
| **Viewer**  | `viewer@example.com`  | `viewer123`  |

## 🌟 API Endpoints Used
This project uses mock APIs provided by `Beeceptor`.

### **Authentication**
- `POST /login` - User authentication

### **User Management**
- `GET /users` - List users
- `GET /users/{user_id}` - Get user details
- `POST /users` - Create user
- `PUT /users/{user_id}` - Update user
- `DELETE /users/{user_id}` - Delete user (Admin only)

### **Company Management**
- `GET /companies` - List companies
- `GET /companies/{company_id}` - Get company details
- `POST /companies` - Create company
- `PUT /companies/{company_id}` - Update company
- `DELETE /companies/{company_id}` - Delete company

### **Blog & Comments**
- `GET /posts` - List all blog posts
- `GET /posts/{post_id}` - Get post details
- `POST /posts` - Create post
- `PUT /posts/{post_id}` - Update post
- `DELETE /posts/{post_id}` - Delete post
- `GET /comments?postId={post_id}` - List comments for a post
- `POST /comments` - Add a comment
- `DELETE /comments/{comment_id}` - Delete a comment

## 🏗️ Technologies Used
- **React + Vite** (Frontend framework)
- **TypeScript** (For type safety)
- **Ant Design** (UI components)
- **Zustand** (State management)
- **React Query** (API data fetching and caching)
- **Axios** (API requests)
- **React Router** (Navigation & protected routes)
