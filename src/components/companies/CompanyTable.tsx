import { Table, Button, Space, Popconfirm } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Company } from "../../types/company";

interface CompanyTableProps {
  companies: Company[];
  onEdit: (company: Company) => void;
  onDelete: (id: number) => void;
  onViewDetails: (company: Company) => void; // New prop for viewing details
}

const CompanyTable: React.FC<CompanyTableProps> = ({ companies, onEdit, onDelete, onViewDetails }) => {
  const columns: ColumnsType<Company> = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Industry", dataIndex: "industry", key: "industry" },
    {
      title: "Revenue",
      dataIndex: "revenue",
      key: "revenue",
      render: (value: number) => value.toLocaleString(),
    },
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

  return <Table dataSource={companies} columns={columns} rowKey={(record) => record.id.toString()} pagination={{ pageSize: 5 }} />;
};

export default CompanyTable;
