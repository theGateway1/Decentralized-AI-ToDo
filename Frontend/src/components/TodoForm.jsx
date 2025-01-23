import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

export const TodoForm = ({ addTodo }) => {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value?.trim()) {
      addTodo(value.trim());
      setValue("");
    } else {
      toast.warn("Please enter a valid task");
    }
  };
  return (
    <form onSubmit={handleSubmit} className="TodoForm">
      <input
        type="text"
        value={value}
        size={20}
        maxLength={20}
        onChange={(e) => setValue(e.target.value)}
        className="todo-input"
        placeholder="What's on your mind?"
      />
      <button type="submit" className="todo-btn">
        <span className="btn-text">Add Task</span>
        <span className="btn-text-small">Add</span>
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
