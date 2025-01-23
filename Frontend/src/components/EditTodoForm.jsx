import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

export const EditTodoForm = ({ editTodo, task }) => {
  const [value, setValue] = useState(task.task);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (value?.trim()) {
      editTodo(value.trim(), task.id);
    } else {
      toast.warn("Please enter a valid task");
    }
  };
  return (
    <form onSubmit={handleSubmit} className="TodoForm edit-mode">
      <input
        type="text"
        value={value}
        size={20}
        maxLength={20}
        onChange={(e) => setValue(e.target.value)}
        className="todo-input"
        placeholder="Update task"
        ref={inputRef}
      />
      <button type="submit" className="todo-btn">
        Save
      </button>
      <ToastContainer
        position="top-center"
        hideProgressBar={true}
        limit={1}
        theme="dark"
      />
    </form>
  );
};
