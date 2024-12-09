//import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { Todo } from './types';
import { updateTodo } from './api';
import { z } from 'zod';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  todo: Todo;
  onUpdate: (todo: Todo) => void;
};

const TodoSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().optional(),
});

const EditTodoDialog: React.FC<Props> = ({
  isOpen,
  onClose,
  todo,
  onUpdate,
}) => {
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || '');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = async () => {
    const result = TodoSchema.safeParse({ title, description });
    if (!result.success) {
      const newErrors: { [key: string]: string } = {};
      result.error.issues.forEach((issue) => {
        newErrors[issue.path[0]] = issue.message;
      });
      setErrors(newErrors);
      return;
    }

    const updatedTodo: Todo = {
      ...todo,
      title: result.data.title,
      description: result.data.description || null,
    };

    const resultTodo = await updateTodo(updatedTodo);
    onUpdate(resultTodo);
    onClose();
    setTitle('');
    setDescription('');
    setErrors({});
  };

  return (
    <div appear show={isOpen} as={Fragment}>
      <div as='div' className='relative z-10' onClose={onClose}>
        <div
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black bg-opacity-25' />
        </div>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <div
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <div className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                <h3
                  as='h3'
                  className='text-lg font-medium leading-6 text-gray-900'
                >
                  Edit TODO
                </h3>
                <div className='mt-2'>
                  <div className='mb-4'>
                    <label
                      htmlFor='title'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Title
                    </label>
                    <input
                      type='text'
                      id='title'
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className='mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                    />
                    {errors.title && (
                      <p className='text-red-500 text-xs mt-1'>{errors.title}</p>
                    )}
                  </div>
                  <div className='mb-4'>
                    <label
                      htmlFor='description'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Description
                    </label>
                    <textarea
                      id='description'
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                    />
                    {errors.description && (
                      <p className='text-red-500 text-xs mt-1'>
                        {errors.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className='mt-4'>
                  <button
                    type='button'
                    className='inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                    onClick={handleSubmit}
                  >
                    Save
                  </button>
                  <button
                    type='button'
                    className='ml-3 inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2'
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTodoDialog;