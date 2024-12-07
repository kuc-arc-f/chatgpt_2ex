import React from "react";
import axios from "axios";

const TodoItem = ({ todo, setTodos, onEdit }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/todos/${todo.id}`);
      setTodos((prev) => prev.filter((item) => item.id !== todo.id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-4 bg-white rounded-md shadow-md flex justify-between items-center">
      <div>
        <h3 className="font-bold">{todo.title}</h3>
        <p>{todo.description}</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(todo)}
          className="bg-yellow-500 text-white px-4 py-2 rounded-md"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
