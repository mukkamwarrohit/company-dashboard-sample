import { Modal, Descriptions } from "antd";
import { Company } from "../../types/company";

interface CompanyDetailsModalProps {
  visible: boolean;
  company: Company | null;
  onClose: () => void;
}

const CompanyDetailsModal: React.FC<CompanyDetailsModalProps> = ({ visible, company, onClose }) => {
  return (
    <Modal open={visible} title="Company Details" onCancel={onClose} footer={null}>
      {company ? (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="ID">{company.id}</Descriptions.Item>
          <Descriptions.Item label="Name">{company.name}</Descriptions.Item>
          <Descriptions.Item label="Industry">{company.industry}</Descriptions.Item>
          <Descriptions.Item label="Revenue">{company.revenue.toLocaleString()}</Descriptions.Item>
        </Descriptions>
      ) : (
        <p>No company data available.</p>
      )}
    </Modal>
  );
};

export default CompanyDetailsModal;
