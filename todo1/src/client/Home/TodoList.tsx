import React from "react";
import TodoItem from "./TodoItem";

const TodoList = ({ todos, setTodos, onEdit }) => {
  return (
    <div className="space-y-4">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} setTodos={setTodos} onEdit={onEdit} />
      ))}
    </div>
  );
};

export default TodoList;
