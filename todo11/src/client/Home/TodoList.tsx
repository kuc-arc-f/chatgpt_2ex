import React, { useState, useEffect } from 'react';
import { Todo } from './types';
import { getTodos, searchTodos } from './api';
import TodoItem from './TodoItem';
import AddTodoDialog from './AddTodoDialog';

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchTodos = async () => {
      const fetchedTodos = await getTodos();
      console.log(fetchedTodos);
      setTodos(fetchedTodos);
    };
    fetchTodos();
  }, []);

  const handleSearch = async () => {
    const fetchedTodos = await searchTodos(searchQuery);
    setTodos(fetchedTodos);
  };

  const handleAddTodo = (newTodo: Todo) => {
    setTodos([...todos, newTodo]);
  };

  const handleUpdateTodo = (updatedTodo: Todo) => {
    setTodos(
      todos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
    );
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>TODO List</h1>

      <div className='flex items-center mb-4'>
        <input
          type='text'
          placeholder='Search...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='border border-gray-300 px-3 py-2 rounded-md mr-2'
        />
        <button
          onClick={handleSearch}
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
        >
          Search
        </button>
      </div>

      <button
        onClick={() => setIsAddDialogOpen(true)}
        className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4'
      >
        Add TODO
      </button>

      {isAddDialogOpen ? (
        <AddTodoDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdd={handleAddTodo}
        />
      ): 
      null}

      <ul>
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onUpdate={handleUpdateTodo}
            onDelete={handleDeleteTodo}
          />
        ))}
      </ul>
    </div>
  );
};

export default TodoList;