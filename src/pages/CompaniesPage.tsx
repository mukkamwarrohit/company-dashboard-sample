import { useReducer, useState } from "react";
import { Typography, Button, Spin, Alert, Input, Select, Modal } from "antd";
import { useCompanies, useCreateCompany, useUpdateCompany, useDeleteCompany } from "../services/companyService";
import CompanyTable from "../components/companies/CompanyTable";
import CompanyForm from "../components/companies/CompanyForm";
import CompanyDetailsModal from "../components/details/CompanyDetailsModal";
import { companiesReducer, CompanySortType } from "../reducers/companiesReducer";
import { Company } from "../types/company";

const CompaniesPage = () => {
  const { data: companies = [], isLoading, isError } = useCompanies();
  const { mutate: createCompany } = useCreateCompany();
  const { mutate: updateCompany } = useUpdateCompany();
  const { mutate: deleteCompany } = useDeleteCompany();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [isCompanyFormVisible, setIsCompanyFormVisible] = useState(false);

  const [sortedCompanies, dispatch] = useReducer(companiesReducer, companies);

  const filteredCompanies = sortedCompanies.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditCompany = (company: Company) => {
    setEditingCompany(company);
    setIsCompanyFormVisible(true);
  };

  const handleSubmitCompany = (companyData: Omit<Company, "id">) => {
    if (editingCompany) {
      updateCompany({ ...editingCompany, ...companyData });
    } else {
      createCompany(companyData);
    }
    setIsCompanyFormVisible(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography.Title level={2}>Manage Companies</Typography.Title>

      <Input
        placeholder="Search Companies..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "16px", width: "300px" }}
      />

      <Select
        defaultValue="Sort Companies"
        style={{ width: 200, marginLeft: 10 }}
        onChange={(value) => dispatch({ type: value as CompanySortType })}
      >
        <Select.Option value={CompanySortType.SORT_BY_NAME}>Sort by Name</Select.Option>
        <Select.Option value={CompanySortType.SORT_BY_REVENUE}>Sort by Revenue</Select.Option>
        <Select.Option value={CompanySortType.SORT_BY_INDUSTRY}>Sort by Industry</Select.Option>
      </Select>

      <Button type="primary" onClick={() => { setEditingCompany(null); setIsCompanyFormVisible(true); }} style={{ marginLeft: 10 }}>
        Add Company
      </Button>

      {isLoading ? (
        <Spin size="large" />
      ) : isError ? (
        <Alert message="Error loading companies!" type="error" showIcon />
      ) : (
        <CompanyTable companies={filteredCompanies} onEdit={handleEditCompany} onDelete={deleteCompany} onViewDetails={setSelectedCompany} />
      )}

      <CompanyDetailsModal visible={!!selectedCompany} company={selectedCompany} onClose={() => setSelectedCompany(null)} />

      <Modal open={isCompanyFormVisible} onCancel={() => setIsCompanyFormVisible(false)} footer={null} destroyOnClose>
        <CompanyForm visible={isCompanyFormVisible} onCancel={() => setIsCompanyFormVisible(false)} onSubmit={handleSubmitCompany} initialValues={editingCompany} />
      </Modal>
    </div>
  );
};

export default CompaniesPage;