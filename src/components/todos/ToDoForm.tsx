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
    if (!values.title.trim()) return; // ✅ Prevent blank titles
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
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item name="title" label="To-Do Title" rules={[{ required: true, message: "Title is required" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="completed" valuePropName="checked">
          <Checkbox>Completed</Checkbox>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            {initialValues?.id ? "Update To-Do" : "Add To-Do"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ToDoForm;
