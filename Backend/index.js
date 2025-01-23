const express = require('express')
const app = express()
const AuthRouter = require('./routes/auth')
const TodoRouter = require('./routes/todo')
const AIRouter = require('./routes/ai-agent')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const path = require('path')

// Handle preflight requests early
app.options('*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS',
  )
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, authToken')
  res.sendStatus(200) // Ends the preflight request here
})

// Add CORS middleware
app.use((req, res, next) => {
  res.setHeader(
    'Access-Control-Allow-Origin',
    'https://modern-ai-todo.netlify.app/',
  )
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS',
  )
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, authToken')
  next()
})

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')))

// App routes
app.get('/', (req, res, next) =>
  res.status(200).send('Hi, from the Modern ToDo App'),
)

app.use('/auth', AuthRouter)
app.use('/todo', TodoRouter)
app.use('/ai-agent', AIRouter)

const port = process.env.PORT || 3002
app.listen(port, () => console.log(`Server listening on port ${port}`))
