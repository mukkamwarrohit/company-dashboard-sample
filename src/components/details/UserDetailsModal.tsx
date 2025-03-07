import { Modal, Descriptions } from "antd";
import { User } from "../../types/user";

interface UserDetailsModalProps {
  visible: boolean;
  user: User | null;
  onClose: () => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ visible, user, onClose }) => {
  return (
    <Modal open={visible} title="User Details" onCancel={onClose} footer={null} centered>
      {user ? (
        <Descriptions bordered column={1} size="middle">
          <Descriptions.Item label="ID">{user.id}</Descriptions.Item>
          <Descriptions.Item label="Name">{user.name}</Descriptions.Item>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Company ID">{user.company_id}</Descriptions.Item>
        </Descriptions>
      ) : (
        <p style={{ textAlign: "center", fontSize: "16px", color: "#888" }}>No user data available.</p>
      )}
    </Modal>
  );
};

export default UserDetailsModal;
