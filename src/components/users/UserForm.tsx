import { useEffect } from "react";
import { Form, Input, Button } from "antd";
import { useCreateUser, useUpdateUser } from "../../services/userService";
import { User } from "../../types/user";

interface UserFormProps {
  user?: User | null;
  onClose: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onClose }) => {
  const [form] = Form.useForm();
  const { mutate: createUser } = useCreateUser();
  const { mutate: updateUser } = useUpdateUser();

  useEffect(() => {
    form.setFieldsValue(user || { name: "", email: "" });
  }, [user]);

  const handleSubmit = (values: Omit<User, "id">) => {
    user ? updateUser({ ...user, ...values }) : createUser(values);
    onClose();
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please enter the name" }]}>
        <Input />
      </Form.Item>
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: "Please enter the email" },
          { type: "email", message: "Please enter a valid email" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          {user ? "Update User" : "Add User"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UserForm;
