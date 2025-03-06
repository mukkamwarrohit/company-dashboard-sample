import { Table, Button, Space, Popconfirm } from "antd";
import type { ColumnsType } from "antd/es/table";
import { User } from "../../types/user";

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  onViewDetails: (user: User) => void; // New prop for viewing details
}

const UserTable: React.FC<UserTableProps> = ({ users, onEdit, onDelete, onViewDetails }) => {
  const columns: ColumnsType<User> = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button onClick={() => onViewDetails(record)}>View Details</Button>
          <Button onClick={() => onEdit(record)}>Edit</Button>
          <Popconfirm title="Are you sure?" onConfirm={() => onDelete(record.id)}>
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return <Table dataSource={users} columns={columns} rowKey={(record) => record.id.toString()} pagination={{ pageSize: 5 }} />;
};

export default UserTable;
