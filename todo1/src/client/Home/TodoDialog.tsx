import React, { useState } from "react";
import { z } from "zod";
import axios from "axios";

const todoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

const TodoDialog = ({ setTodos, editingTodo, onClose }) => {
  const [formData, setFormData] = useState(
    editingTodo || { title: "", description: "" }
  );
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    // バリデーション
    const result = todoSchema.safeParse(formData);
    if (!result.success) {
      const errorMessages = result.error.format();
      setErrors({
        title: errorMessages.title?._errors[0],
      });
      return;
    }

    try {
      if (editingTodo) {
        // 編集
        const response = await axios.put(
          `/api/todos/${editingTodo.id}`,
          formData
        );
        setTodos((prev) =>
          prev.map((todo) =>
            todo.id === editingTodo.id ? { ...todo, ...response.data } : todo
          )
        );
      } else {
        // 新規追加
        const response = await axios.post("/api/todos", formData);
        setTodos((prev) => [...prev, response.data]);
      }
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          {editingTodo ? "Edit TODO" : "Add TODO"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="border p-2 w-full rounded-md"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="border p-2 w-full rounded-md"
            ></textarea>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TodoDialog;
