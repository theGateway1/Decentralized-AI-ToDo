const { HfInference } = require('@huggingface/inference')
require('dotenv').config({ path: '.env' })
const HttpStatus = require('http-status-codes')
const { Results } = require('../common/typedefs')
const moment = require('moment-timezone')

const client = new HfInference(process.env.HUGGINGFACE_API_KEY)

const currentTimeInIndia = () => {
  return moment().tz('Asia/Kolkata').format('Do MMM h:mm A')
}

const getOverdueTasksHelper = async (taskList) => {
  const chatCompletion = await client.chatCompletion({
    model: 'meta-llama/Llama-3.2-1B-Instruct',
    messages: [
      {
        role: 'system',
        content: `You are an expert mathematician specializing in finding overdue tasks using simple mathematics. Based on current time: ${currentTimeInIndia()}, analyze each task of the following task list and determine the tasks that are overdue. Return the exact task names separated by coma - only those tasks that are overdue as of current time. If task has no time/deadline mentioned, don't assume a deadline, just skip it. Share your analysis in 20 words or less.`,
      },
      {
        role: 'user',
        content: `Here is the task list:\n\n${taskList.join(', ')}\n\nThe output should contain the tasks that are overdue as of current time.`,
      },
    ],
    temperature: 0.5,
    max_tokens: 600,
  })

  const overdueTasks = chatCompletion.choices[0].message['content']
  console.log('Overdue Task:', overdueTasks)
  return overdueTasks
}

exports.getNextTaskBasedOnPriority = async (req, res, next) => {
  try {
    const taskList = req.body.taskList
    if (!taskList || !taskList.length) {
      throw new Error('Task list not provided')
    }

    // Check if there are any overdue tasks
    var highPriorityTask = await getOverdueTasksHelper(taskList)

    if (!highPriorityTask) {
      const chatCompletion = await client.chatCompletion({
        model: 'meta-llama/Llama-3.2-1B-Instruct',
        messages: [
          {
            role: 'system',
            content: `You are an expert assistant specializing in task prioritization. Based on deadlines, importance, and context, analyze the following task list and determine the task with the highest priority that I should do next. If task has deadline, the highest priority level should be given to overdue task based on current time: ${currentTimeInIndia()}. Output should have one task only. Return exact task name.`,
          },
          {
            role: 'user',
            content: `Here is the task list:\n\n${taskList.join(', ')}\n\nThe output should only contain the exact name of the task having the highest priority. Not a word more`,
          },
        ],
        temperature: 0.6,
        max_tokens: 500,
      })

      highPriorityTask = chatCompletion.choices[0].message['content']
    }

    console.log('Task with highest priority:', highPriorityTask)
    res.status(HttpStatus.StatusCodes.OK).json({ task: highPriorityTask })
  } catch (error) {
    console.error(error)
    res
      .status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: Results.INTERNAL_SERVER_ERROR })
  }
}

exports.getMotivationalQuote = async (req, res, next) => {
  try {
    const chatCompletion = await client.chatCompletion({
      model: 'meta-llama/Llama-3.2-1B-Instruct',
      messages: [
        {
          role: 'user',
          content: `You are an expert motivator. Provide a motivational quote for me to get things done. No more than 20 words.`,
        },
      ],
      temperature: 0.8,
      max_tokens: 100,
    })

    const quote = chatCompletion.choices[0].message['content'] + '⚡'
    console.log('Quote:', quote)
    res.status(HttpStatus.StatusCodes.OK).json({ quote })
  } catch (error) {
    console.error(error)
    res
      .status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: Results.INTERNAL_SERVER_ERROR })
  }
}

exports.getOverdueTasks = async (req, res, next) => {
  try {
    const taskList = req.body.taskList
    if (!taskList || !taskList.length) {
      throw new Error('Task list not provided')
    }

    const overdueTasks = await getOverdueTasksHelper(taskList)
    res.status(HttpStatus.StatusCodes.OK).json({ task: overdueTasks })
  } catch (error) {
    console.error(error)
    res
      .status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: Results.INTERNAL_SERVER_ERROR })
  }
}
