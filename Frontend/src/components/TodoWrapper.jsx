import React, { useEffect, useRef, useState } from "react";
import { Todo } from "./Todo";
import { TodoForm } from "./TodoForm";
import { EditTodoForm } from "./EditTodoForm";
import {
  getTodo,
  addTodoToList,
  deleteTodoFromList,
  toggleTodoStatus,
  updateTask,
} from "../shared/Services/Todo/todo-service";
import { ErrorScreen } from "../shared/components/Error-Screen/error-screen";
import Spinner from "../shared/components/Loader/loader";
import { toast, ToastContainer } from "react-toastify";
import { ChatWidget } from "./Chat/ChatWidget";
import TaskCompletionChart from "./TaskCompletionChart/TaskCompletionChart";

export const TodoWrapper = () => {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorOccured, setErrorOccured] = useState(false);
  const todoListRef = useRef(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);

  useEffect(() => {
    if (todoListRef.current) {
      todoListRef.current.scrollTop = todoListRef.current.scrollHeight;
    }
  }, [todos]);

  useEffect(() => {
    if (!todos.length) {
      setIsLoading(true);
      getTodo()
        .then((todoList) => {
          console.log(todoList);
          setTodos(todoList);

          // If list has tasks added, open AI agent with a 3 secs delay
          if (todoList.length) {
            setTimeout(() => {
              setIsChatOpen(true);
            }, 3000);
          }
        })
        .catch((error) => {
          setErrorOccured(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setTodos(todos);
    }
  }, []);

  useEffect(() => {
    setCompletedTasks(todos.filter((todo) => todo.completed).length);
    setTotalTasks(todos.length);
  }, [todos]);

  const addTodo = (todo) => {
    if (!todo.trim()) return;
    setIsLoading(true);
    addTodoToList(todo)
      .then((taskId) => {
        setTodos([
          ...todos,
          { id: taskId, task: todo, completed: false, isEditing: false },
        ]);
        toast.success("You can always ask AI for motivation 🚀");
        setTimeout(() => {
          setIsChatOpen(true);
        }, 2000);
      })
      .catch((error) => {
        toast.warn("Failed to add task");
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const deleteTodo = (id) => {
    setIsLoading(true);
    deleteTodoFromList(id)
      .then(() => {
        setTodos(todos.filter((todo) => todo.id !== id));
        toast.success("Task deleted successfully");
      })
      .catch((error) => {
        console.error(error);
        toast.warn("Failed to delete task");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const toggleStatus = (id) => {
    setIsLoading(true);
    const markedInomplete = todos.find((todo) => todo.id === id).completed;
    toggleTodoStatus(id)
      .then(() => {
        setTodos(
          todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          )
        );

        // Raise toast if task is marked as complete
        if (!markedInomplete) {
          toast.success("Going good - Find what's next⚡");
        }

        setTimeout(() => {
          setIsChatOpen(true);
        }, 2000);
      })
      .catch((error) => {
        console.error(error);
        console.error("Failed to update task status");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const editTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo
      )
    );
  };

  const editTask = (task, id) => {
    setIsLoading(true);
    updateTask(id, task)
      .then(() => {
        setTodos(
          todos.map((todo) =>
            todo.id === id
              ? { ...todo, task, isEditing: !todo.isEditing }
              : todo
          )
        );
        toast.success("Task updated successfully");
      })
      .catch((error) => {
        console.error(error);
        toast.warn("Failed to update task");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      {errorOccured && !isLoading ? (
        <ErrorScreen errorMessage={"Failed to load Todos"}></ErrorScreen>
      ) : (
        <div className="TodoWrapper">
          <div className="todo-header">
            <h1 className={todos.length === 0 ? "centered" : ""}>
              Get Things Done !
            </h1>
            {todos.length > 0 && (
              <TaskCompletionChart
                completedTasks={completedTasks}
                totalTasks={totalTasks}
              />
            )}
          </div>
          <TodoForm addTodo={addTodo} />

          <div className="TodoList" ref={todoListRef}>
            {todos.map((todo) =>
              todo.isEditing ? (
                <EditTodoForm editTodo={editTask} task={todo} />
              ) : (
                <Todo
                  key={todo.id}
                  task={todo}
                  deleteTodo={deleteTodo}
                  editTodo={editTodo}
                  toggleStatus={toggleStatus}
                />
              )
            )}
          </div>
        </div>
      )}
      <button className="chat-btn" onClick={() => setIsChatOpen(!isChatOpen)}>
        Ask AI ✨
      </button>
      {isChatOpen && (
        <ChatWidget onClose={() => setIsChatOpen(false)} todos={todos} />
      )}
      <ToastContainer
        position="top-center"
        hideProgressBar={true}
        limit={1}
        theme="dark"
      />
      <Spinner showSpinner={isLoading} />
    </>
  );
};
