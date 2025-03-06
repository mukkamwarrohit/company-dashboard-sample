import { Modal, Form, Input, Checkbox, Button } from "antd";
import { useEffect } from "react";
import { ToDo } from "../../types/todo";

interface ToDoFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (todo: Omit<ToDo, "id">) => void;
  initialValues?: ToDo | null;
}

const ToDoForm: React.FC<ToDoFormProps> = ({ visible, onCancel, onSubmit, initialValues }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleFinish = (values: Omit<ToDo, "id">) => {
    if (!values.title.trim()) return;
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Modal
      open={visible}
      title={initialValues?.id ? "Edit To-Do" : "Add To-Do"}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      footer={null}
      destroyOnClose
      centered
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item 
          name="title" 
          label="To-Do Title" 
          rules={[{ required: true, message: "Title is required" }]}
        >
          <Input placeholder="Enter to-do task" />
        </Form.Item>
        <Form.Item name="completed" valuePropName="checked">
          <Checkbox>Mark as Completed</Checkbox>
        </Form.Item>
        <Form.Item style={{ textAlign: "right" }}>
          <Button onClick={onCancel} style={{ marginRight: 8 }}>Cancel</Button>
          <Button type="primary" htmlType="submit">
            {initialValues?.id ? "Update To-Do" : "Add To-Do"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ToDoForm;