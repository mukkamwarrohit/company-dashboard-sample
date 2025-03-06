import { Table, Button, Space, Popconfirm, Select, Input } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useReducer, useState, useEffect } from "react";
import { companiesReducer, CompanySortType } from "../../reducers/companiesReducer";
import { Company } from "../../types/company";

interface CompanyTableProps {
  companies: Company[];
  onEdit: (company: Company) => void;
  onDelete: (id: number) => void;
  onViewDetails: (company: Company) => void;
}

const CompanyTable: React.FC<CompanyTableProps> = ({ companies, onEdit, onDelete, onViewDetails }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortedCompanies, dispatch] = useReducer(companiesReducer, companies);

  useEffect(() => {
    dispatch({ type: CompanySortType.SORT_BY_NAME }); // Default sort
  }, [companies]);

  const handleSortChange = (value: CompanySortType) => {
    dispatch({ type: value });
  };

  const filteredCompanies = sortedCompanies.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: ColumnsType<Company> = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Industry", dataIndex: "industry", key: "industry" },
    {
      title: "Revenue",
      dataIndex: "revenue",
      key: "revenue",
      render: (value?: number) => (value ? `$${value.toLocaleString()}` : "N/A"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button onClick={() => onViewDetails(record)}>View</Button>
          <Button onClick={() => onEdit(record)}>Edit</Button>
          <Popconfirm title="Are you sure you want to delete?" onConfirm={() => onDelete(record.id)}>
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search by company name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select defaultValue="Sort By" style={{ width: 200 }} onChange={handleSortChange}>
          <Select.Option value={CompanySortType.SORT_BY_NAME}>Name</Select.Option>
          <Select.Option value={CompanySortType.SORT_BY_REVENUE}>Revenue</Select.Option>
          <Select.Option value={CompanySortType.SORT_BY_INDUSTRY}>Industry</Select.Option>
        </Select>
      </Space>
      <Table dataSource={filteredCompanies} columns={columns} rowKey={(record) => record.id.toString()} pagination={{ pageSize: 5 }} />
    </div>
  );
};

export default CompanyTable;
