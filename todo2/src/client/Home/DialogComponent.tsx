import React, { useState } from "react";
//import { Dialog } from "@headlessui/react";
import { z } from "zod";
import axios from "axios";

//public_type: z.enum(["public", "private"]),
const todoSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  content: z.string().min(1, "コンテンツは必須です"),
  public_type: z.boolean(),
  food_orange: z.boolean(),
  food_apple: z.boolean(),
  food_banana: z.boolean(),
  pub_date: z.string().optional(),
  qty1: z.string().optional(),
  qty2: z.string().optional(),
  qty3: z.string().optional(),
});

const DialogComponent = ({ 
  isOpen, onClose, onSubmit, initialData , editingTodo
}) => {
  //initialData || {
  const [formData, setFormData] = useState(
    editingTodo || {
      title: "",
      content: "",
      public_type: true,
      food_orange: false,
      food_apple: false,
      food_banana: false,
      pub_date: "",
      qty1: "",
      qty2: "",
      qty3: "",
    }
  );
  const [errors, setErrors] = useState({});
  console.log("#DialogComponent");
  console.log(editingTodo);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log("name=", name);
    console.log("value=", value);
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      console.log("#handleSubmit");
      console.log(formData);
      
      const target = formData;
      let public_typeValue = true;
      if(target.public_type === "private"){ public_typeValue = false; }
      target.public_type = public_typeValue;
      console.log(target);
      todoSchema.parse(target);
      //onSubmit(formData);
      if (editingTodo) {
        const response = await axios.put(
          `/api/todos/${editingTodo.id}`,
          target
        );
        console.log(response.data);
        location.reload();
        /*
        setTodos((prev) =>
          prev.map((todo) =>
            todo.id === editingTodo.id ? { ...todo, ...response.data } : todo
          )
        );
        */
      }else{
        // 新規追加
        const response = await axios.post("/api/todos", formData);
        //setTodos((prev) => [...prev, response.data]);
      }
      onClose();
    } catch (err) {
      console.error(err);
      if (err instanceof z.ZodError) {
        const fieldErrors = err.errors.reduce((acc, error) => {
          acc[error.path[0]] = error.message;
          return acc;
        }, {});
        setErrors(fieldErrors);
      }
    }
  };
  /* 
  Dialog open={isOpen} onClose={onClose} className="relative z-50"
  <Dialog.Panel className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
  */
  return (
    <div>
      <div className="fixed inset-0 bg-black/30" aria-hidden="true"></div>
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-medium">TODOの編集</h3>
          <div className="mt-4 space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium">タイトル</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md shadow-sm p-2 focus:ring focus:ring-indigo-500"
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
            </div>
            {/* Content */}
            <div>
              <label className="block text-sm font-medium">コンテンツ</label>
              <input
                type="text"
                name="content"
                value={formData.content}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md shadow-sm p-2 focus:ring focus:ring-indigo-500"
              />
              {errors.content && <p className="text-red-500 text-sm">{errors.content}</p>}
            </div>
            {/* Public Type */}
            <div>
              <label className="block text-sm font-medium">公開設定</label>
              <div className="mt-1 space-x-4">
                <label>
                  <input
                    type="radio"
                    name="public_type"
                    value="public"
                    defaultChecked={formData.public_type === true}
                    onChange={handleChange}
                  />
                  公開
                </label>
                <label>
                  <input
                    type="radio"
                    name="public_type"
                    value="private"
                    defaultChecked={formData.public_type === false}
                    onChange={handleChange}
                  />
                  非公開
                </label>
              </div>
            </div>
            {/* Food Checkboxes */}
            <div>
              <label className="block text-sm font-medium">フード選択</label>
              <div className="mt-1 space-x-4">
                <label>
                  <input
                    type="checkbox"
                    name="food_orange"
                    checked={formData.food_orange}
                    onChange={handleChange}
                  />
                  オレンジ
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="food_apple"
                    checked={formData.food_apple}
                    onChange={handleChange}
                  />
                  りんご
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="food_banana"
                    checked={formData.food_banana}
                    onChange={handleChange}
                  />
                  バナナ
                </label>
              </div>
            </div>
            {/* Pub Date */}
            <div>
              <label className="block text-sm font-medium">公開日</label>
              <input
                type="date"
                name="pub_date"
                value={formData.pub_date}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md shadow-sm p-2 focus:ring focus:ring-indigo-500"
              />
            </div>
            {/* Quantity Fields */}
            {["qty1", "qty2", "qty3"].map((qty) => (
              <div key={qty}>
                <label className="block text-sm font-medium">{qty.toUpperCase()}</label>
                <input
                  type="text"
                  name={qty}
                  value={formData[qty]}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md shadow-sm p-2 focus:ring focus:ring-indigo-500"
                />
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end space-x-4">
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
              onClick={onClose}
            >
              キャンセル
            </button>
            <button
              className="bg-indigo-500 text-white px-4 py-2 rounded-md"
              onClick={handleSubmit}
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DialogComponent;
