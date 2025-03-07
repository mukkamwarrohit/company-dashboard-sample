import { useReducer, useState } from "react";
import { Typography, Button, Spin, Alert, Input, Select, Modal } from "antd";
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from "../services/userService";
import UserTable from "../components/users/UserTable";
import UserForm from "../components/users/UserForm";
import UserDetailsModal from "../components/details/UserDetailsModal";
import { usersReducer, UserSortType } from "../reducers/usersReducer";
import { User } from "../types/user";
import { useAuthStore } from "../store/authStore"; // Import auth store

const UsersPage = () => {
  const { user, hasRole } = useAuthStore();
  const { data: users = [], isLoading, isError } = useUsers();
  const { mutate: createUser } = useCreateUser();
  const { mutate: updateUser } = useUpdateUser();
  const { mutate: deleteUser } = useDeleteUser();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isUserFormVisible, setIsUserFormVisible] = useState(false);

  const [sortedUsers, dispatch] = useReducer(usersReducer, users);

  // Filtered Users based on Search Term
  const filteredUsers = sortedUsers.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditUser = (user: User) => {
    if (!hasRole(["admin", "editor"])) {
      alert("You do not have permission to edit users.");
      return;
    }
    setEditingUser(user);
    setIsUserFormVisible(true);
  };

  const handleDeleteUser = (userId: number) => {
    if (!hasRole(["admin"])) {
      alert("Only admins can delete users.");
      return;
    }
    deleteUser(userId);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography.Title level={2}>Manage Users</Typography.Title>

      <Input
        placeholder="Search Users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "16px", width: "300px" }}
      />

      <Select
        defaultValue="Sort Users"
        style={{ width: 200, marginLeft: 10 }}
        onChange={(value) => dispatch({ type: value as UserSortType })}
      >
        <Select.Option value={UserSortType.SORT_BY_NAME}>Sort by Name</Select.Option>
        <Select.Option value={UserSortType.SORT_BY_EMAIL}>Sort by Email</Select.Option>
      </Select>

      {hasRole(["admin"]) && (
        <Button type="primary" onClick={() => { setEditingUser(null); setIsUserFormVisible(true); }} style={{ marginLeft: 10 }}>
          Add User
        </Button>
      )}

      {isLoading ? (
        <Spin size="large" />
      ) : isError ? (
        <Alert message="Error loading users!" type="error" showIcon />
      ) : (
        <UserTable users={filteredUsers} onEdit={handleEditUser} onDelete={handleDeleteUser} onViewDetails={setSelectedUser} />
      )}

      <UserDetailsModal visible={!!selectedUser} user={selectedUser} onClose={() => setSelectedUser(null)} />

      <Modal open={isUserFormVisible} onCancel={() => setIsUserFormVisible(false)} footer={null} destroyOnClose>
        <UserForm user={editingUser} onClose={() => setIsUserFormVisible(false)} />
      </Modal>
    </div>
  );
};

export default UsersPage;
