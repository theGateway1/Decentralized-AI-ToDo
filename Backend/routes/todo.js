const express = require('express')
const router = express.Router()
const TodoController = require('../controllers/todo')
const AuthController = require('../controllers/auth')

// Get list of products for home page
router.get(
  '/get-todos/',
  AuthController.validateUserAuthToken, // User should be authenticated
  TodoController.getTodos,
)

// Add task to the todo list
router.post(
  '/add-todo/',
  AuthController.validateUserAuthToken, // User should be authenticated
  TodoController.addTodo,
)

// Delete todo from list
router.delete(
  '/delete-todo/:id',
  AuthController.validateUserAuthToken, // User should be authenticated
  TodoController.deleteTodo,
)

// Toggle todo complete status
router.put(
  '/toggle-todo-status/:id',
  AuthController.validateUserAuthToken, // User should be authenticated
  TodoController.toggleTodoStatus,
)

// Update todo
router.put(
  '/update-todo/:id',
  AuthController.validateUserAuthToken, // User should be authenticated
  TodoController.updateTodo,
)

module.exports = router
