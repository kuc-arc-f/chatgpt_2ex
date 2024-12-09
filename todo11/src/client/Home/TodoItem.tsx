import React, { useState } from 'react';
import { Todo } from './types';
import EditTodoDialog from './EditTodoDialog';
import { deleteTodo } from './api';

type Props = {
  todo: Todo;
  onUpdate: (todo: Todo) => void;
  onDelete: (id: number) => void;
};

const TodoItem: React.FC<Props> = ({ todo, onUpdate, onDelete }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleDelete = async () => {
    await deleteTodo(todo.id);
    onDelete(todo.id);
  };

  return (
    <li className='flex items-center justify-between border-b border-gray-300 py-2'>
      <span className={todo.completed ? 'line-through text-gray-500' : ''}>
        {todo.title}
      </span>
      <div>
        <button
          onClick={() => setIsEditDialogOpen(true)}
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2'
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className='bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded'
        >
          Delete
        </button>
      </div>
      {isEditDialogOpen ? (
        <EditTodoDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        todo={todo}
        onUpdate={onUpdate}
        />
      ): 
      null}

    </li>
  );
};

export default TodoItem;