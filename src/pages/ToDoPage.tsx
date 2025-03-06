import { useState, useReducer } from "react";
import { Typography, Button, Spin, Alert, Table, Select } from "antd";
import { useTodos, useCreateTodo, useUpdateTodo, useDeleteTodo } from "../services/toDoService";
import ToDoForm from "../components/todos/ToDoForm";
import { ToDo } from "../types/todo";
import { toDoReducer, ToDoState } from "../reducers/toDoReducer";

const { Option } = Select;

const initialState: ToDoState = {
  filter: "ALL",
  sort: "TITLE_ASC",
};

const ToDoPage = () => {
  const { data: todos = [], isLoading, isError } = useTodos();
  const { mutate: createTodo } = useCreateTodo();
  const { mutate: updateTodo } = useUpdateTodo();
  const { mutate: deleteTodo } = useDeleteTodo();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<ToDo | null>(null);
  const [state, dispatch] = useReducer(toDoReducer, initialState);

  const handleAddToDo = () => {
    setEditingTodo(null);
    setIsModalOpen(true);
  };

  const handleEditToDo = (todo: ToDo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  const handleSubmit = (todo: Omit<ToDo, "id">) => {
    if (editingTodo) {
      updateTodo({ id: editingTodo.id, ...todo });
    } else {
      createTodo(todo);
    }
    setIsModalOpen(false);
  };

  // Apply Filtering
  let filteredTodos = todos;
  if (state.filter === "COMPLETED") {
    filteredTodos = todos.filter((todo) => todo.completed);
  } else if (state.filter === "PENDING") {
    filteredTodos = todos.filter((todo) => !todo.completed);
  }

  // Apply Sorting (Fix for `undefined` titles)
  filteredTodos = [...filteredTodos].sort((a, b) => {
    const titleA = a.title || ""; // ✅ Ensure valid string
    const titleB = b.title || ""; // ✅ Ensure valid string
    if (state.sort === "TITLE_ASC") {
      return titleA.localeCompare(titleB);
    } else {
      return titleB.localeCompare(titleA);
    }
  });

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Completed", dataIndex: "completed", key: "completed", render: (completed: boolean) => (completed ? "✅ Yes" : "❌ No") },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: ToDo) => (
        <>
          <Button onClick={() => handleEditToDo(record)}>Edit</Button>
          <Button danger style={{ marginLeft: 10 }} onClick={() => deleteTodo(record.id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Typography.Title level={2}>To-Do List</Typography.Title>
      <Button type="primary" onClick={handleAddToDo} style={{ marginBottom: "16px" }}>
        Add New To-Do
      </Button>

      {/* Sorting & Filtering Controls */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
        <Select value={state.filter} onChange={(value) => dispatch({ type: value as any })} style={{ width: 150 }}>
          <Option value="FILTER_ALL">All</Option>
          <Option value="FILTER_COMPLETED">Completed</Option>
          <Option value="FILTER_PENDING">Pending</Option>
        </Select>
        <Select value={state.sort} onChange={(value) => dispatch({ type: value as any })} style={{ width: 180 }}>
          <Option value="SORT_TITLE_ASC">Sort by Title (A-Z)</Option>
          <Option value="SORT_TITLE_DESC">Sort by Title (Z-A)</Option>
        </Select>
      </div>

      {isLoading ? (
        <Spin size="large" style={{ display: "block", textAlign: "center", marginTop: "20px" }} />
      ) : isError ? (
        <Alert message="Error loading To-Dos!" type="error" showIcon />
      ) : (
        <Table 
          dataSource={filteredTodos.map(todo => ({ ...todo, key: todo.id }))} // ✅ Ensure key is assigned
          columns={columns} 
          rowKey="id" // ✅ Ensure React uses `id` as key
          pagination={{ pageSize: 5 }} 
        />
      )}

      <ToDoForm visible={isModalOpen} onCancel={() => setIsModalOpen(false)} onSubmit={handleSubmit} initialValues={editingTodo} />
    </div>
  );
};

export default ToDoPage;
