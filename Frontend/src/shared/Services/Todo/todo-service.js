import api from "../../utils/api";

export const getTodo = () => {
  return new Promise((resolve, reject) => {
    api
      .get("/todo/get-todos")
      .then((todos) => {
        resolve(todos);
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
};

export const addTodoToList = (task) => {
  return new Promise((resolve, reject) => {
    api
      .post("/todo/add-todo", { task })
      .then((response) => {
        resolve(response.taskId);
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
};

export const deleteTodoFromList = (id) => {
  return new Promise((resolve, reject) => {
    api
      .delete("/todo/delete-todo/" + id)
      .then((response) => {
        resolve(response.taskId);
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
};

export const toggleTodoStatus = (id) => {
  return new Promise((resolve, reject) => {
    api
      .put("/todo/toggle-todo-status/" + id)
      .then((response) => {
        resolve(response.taskId);
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
};

export const updateTask = (id, task) => {
  return new Promise((resolve, reject) => {
    api
      .put("/todo/update-todo/" + id, { task })
      .then(() => {
        resolve();
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
};

const parseList = (taskList) => {
  if (!taskList?.length) {
    return;
  }
  return taskList.filter((task) => !task.completed).map((task) => task.task);
};

export const getOverdueTasks = (taskList) => {
  taskList = parseList(taskList);
  return new Promise((resolve, reject) => {
    if (!taskList?.length) {
      return resolve("All Clear 🎉");
    }

    api
      .put("/ai-agent/get-overdue-tasks/", { taskList })
      .then((response) => {
        resolve(response.task);
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
};

export const getPriorityBasedNextTask = (taskList) => {
  return new Promise((resolve, reject) => {
    taskList = parseList(taskList);
    if (!taskList?.length) {
      return resolve("Make a to-do list 😁");
    }

    if (taskList.length === 1) {
      return resolve(taskList[0]);
    }

    api
      .put("/ai-agent/get-next-task/", { taskList })
      .then((response) => {
        resolve(response.task);
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
};

export const getMotivationalQuote = (taskList) => {
  return new Promise((resolve, reject) => {
    if (!taskList?.length) {
      return resolve("It all starts with a To-Do list⚡");
    }

    api
      .get("/ai-agent/get-motivational-quote/")
      .then((response) => {
        resolve(response.quote);
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
};
