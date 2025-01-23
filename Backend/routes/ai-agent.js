const express = require('express')
const router = express.Router()
const AIAgent = require('../controllers/ai-agent')
const AuthController = require('../controllers/auth')

// Get next task based on priority
router.put(
  '/get-next-task/',
  AuthController.validateUserAuthToken, // User should be authenticated
  AIAgent.getNextTaskBasedOnPriority,
)

// Get motivational quote
router.get(
  '/get-motivational-quote/',
  AuthController.validateUserAuthToken, // User should be authenticated
  AIAgent.getMotivationalQuote,
)

// Get overdue tasks
router.put(
  '/get-overdue-tasks/',
  AuthController.validateUserAuthToken, // User should be authenticated
  AIAgent.getOverdueTasks,
)

module.exports = router
