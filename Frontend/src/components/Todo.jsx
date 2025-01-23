import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faSquareCheck,
  faPenToSquare,
  faSquare,
} from "@fortawesome/free-solid-svg-icons";

export const Todo = ({ task, deleteTodo, editTodo, toggleStatus }) => {
  return (
    <div className="Todo">
      <FontAwesomeIcon
        icon={task.completed ? faSquareCheck : faSquare}
        onClick={() => toggleStatus(task.id)}
      />
      <p className={`${task.completed ? "completed" : "incompleted"}`}>
        {task.task}
      </p>
      <div>
        <FontAwesomeIcon
          className="edit-icon"
          icon={faPenToSquare}
          onClick={() => editTodo(task.id)}
        />
        <FontAwesomeIcon
          className="delete-icon"
          icon={faTrash}
          color="white"
          onClick={() => deleteTodo(task.id)}
        />
      </div>
    </div>
  );
};
