import React, { useState, useEffect } from "react";
import TodoList from "./Home/TodoList";
import TodoDialog from "./Home/DialogComponent";
import axios from "axios";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);

  // 初期データ取得
  useEffect(() => {
    axios.get("http://localhost:3000/api/todos").then((response) => {
      setTodos(response.data);
    });
  }, []);

  // 検索機能
  const handleSearch = () => {
    axios
      .get(`http://localhost:3000/api/todos/search?query=${searchQuery}`)
      .then((response) => {
        setTodos(response.data);
      });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">TODO App</h1>
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          className="border p-2 flex-1 rounded-md"
          placeholder="Search TODOs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Search
        </button>
      </div>
      <button
        onClick={() => {
          setEditingTodo(null);
          setIsDialogOpen(true);
        }}
        className="bg-green-500 text-white px-4 py-2 rounded-md mb-4"
      >
        Add TODO
      </button>
      <TodoList
        todos={todos}
        setTodos={setTodos}
        onEdit={(todo) => {
          setEditingTodo(todo);
          setIsDialogOpen(true);
          console.log("#home.onEdit");
          console.log(todo);
        }}
      />
      {isDialogOpen && (
        <TodoDialog
          setTodos={setTodos}
          editingTodo={editingTodo}
          onClose={() => setIsDialogOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
