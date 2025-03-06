import { Modal, Form, Input, InputNumber, Button } from "antd";
import { useEffect } from "react";
import { Company } from "../../types/company";

interface CompanyFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (company: Omit<Company, "id">) => void;
  initialValues?: Company | null;
}

const CompanyForm: React.FC<CompanyFormProps> = ({ visible, onCancel, onSubmit, initialValues }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(initialValues || { name: "", industry: "", revenue: 0 });
  }, [initialValues]);

  const handleFinish = (values: Omit<Company, "id">) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Modal
      open={visible}
      title={initialValues?.id ? "Edit Company" : "Add Company"}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item name="name" label="Company Name" rules={[{ required: true, message: "Name is required" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="industry" label="Industry" rules={[{ required: true, message: "Industry is required" }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="revenue"
          label="Revenue"
          rules={[
            { required: true, message: "Revenue is required" },
            { type: "number", min: 0, message: "Revenue must be a positive number" },
          ]}
        >
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {initialValues?.id ? "Update Company" : "Add Company"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CompanyForm;
