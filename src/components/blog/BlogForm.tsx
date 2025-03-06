import { Modal, Form, Input, Button } from "antd";
import { useEffect } from "react";
import { BlogPost } from "../../types/blog";

interface BlogFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (post: Omit<BlogPost, "id">) => void;
  initialValues?: BlogPost | null;
}

const BlogForm: React.FC<BlogFormProps> = ({ visible, onCancel, onSubmit, initialValues }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleFinish = (values: Omit<BlogPost, "id">) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Modal
      open={visible}
      title={initialValues?.id ? "Edit Blog Post" : "Add Blog Post"}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item name="title" label="Title" rules={[{ required: true, message: "Title is required" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="body" label="Content" rules={[{ required: true, message: "Content is required" }]}>
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            {initialValues?.id ? "Update Blog Post" : "Add Blog Post"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BlogForm;
