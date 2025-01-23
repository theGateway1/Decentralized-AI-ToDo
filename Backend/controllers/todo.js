const HttpStatus = require('http-status-codes')
const TaskAbi = require('../Blockchain/build/contracts/TaskContract.json')
const { TaskContractAddress } = require('../Blockchain/config')
const { Results } = require('../common/typedefs')
const { Web3 } = require('web3')
require('dotenv').config({ path: '.env' })

// Initialize Web3 with an HTTP provider
const web3 = new Web3(process.env.ANKR_POLYGON_RPC_URL)
const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY)
web3.eth.accounts.wallet.add(account)
web3.eth.defaultAccount = account.address

// Initialize the contract
const taskContract = new web3.eth.Contract(TaskAbi.abi, TaskContractAddress)

/**
 * Middleware function to add task to the Todo list
 * @param {String} req.body.task - The task to be added
 * @returns {String} - Result of the operation
 */
exports.addTodo = async (req, res, next) => {
  try {
    const task = req.body.task
    const userAddress = req.userAddress

    if (!task || !userAddress) {
      throw new Error('Task or user address not provided')
    }

    // Prepare the transaction data
    const tx = taskContract.methods.addTask(task, userAddress)

    // Estimate gas for the transaction
    const gas = await tx.estimateGas({ from: account.address })

    // Get the gas price
    const gasPrice = await web3.eth.getGasPrice()

    // Encode the transaction data
    const txData = tx.encodeABI()

    // Create and sign the transaction
    const transaction = {
      to: TaskContractAddress,
      from: account.address,
      data: txData,
      gas,
      gasPrice,
    }

    console.log('Sending transaction...')
    const signedTx = await web3.eth.accounts.signTransaction(
      transaction,
      process.env.PRIVATE_KEY,
    )

    // Send the signed transaction
    const receipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction,
    )

    // Extract the taskId from event data
    const event = receipt.logs.find(
      (log) =>
        log.topics[0] === web3.utils.keccak256('TaskCreated(uint256,address)'),
    )

    if (event) {
      const decoded = web3.eth.abi.decodeLog(
        [
          {
            indexed: false,
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            indexed: false,
            internalType: 'address',
            name: 'recipient',
            type: 'address',
          },
        ],
        event.data,
        event.topics.slice(1),
      )

      console.log('Task:', task, 'added with id:', decoded.id)
      console.log('Owner Address:', decoded.recipient)
      res
        .status(HttpStatus.StatusCodes.OK)
        .json({ taskId: decoded.id.toString() })
    } else {
      console.error('TaskCreated event not found in transaction logs.')
      res
        .status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: Results.INTERNAL_SERVER_ERROR })
    }
  } catch (error) {
    console.error(error)
    res
      .status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: Results.INTERNAL_SERVER_ERROR })
  }
}

/**
 * Middleware function to update task
 * @param {String} req.params.id - id of task to be updated
 * @param {String} req.body.task - The task to be added
 * @returns {String} - Result of the operation
 */
exports.updateTodo = async (req, res, next) => {
  try {
    const id = req.params.id
    const task = req.body.task
    const userAddress = req.userAddress

    console.log('id:', id)
    console.log('task:', task)

    if (!id || !task || !userAddress) {
      throw new Error('Missing request parameters')
    }

    // Prepare the transaction data
    const tx = taskContract.methods.updateTask(id, task, userAddress)

    // Estimate gas for the transaction
    const gas = await tx.estimateGas({ from: account.address })

    // Get the gas price
    const gasPrice = await web3.eth.getGasPrice()

    // Encode the transaction data
    const txData = tx.encodeABI()

    // Create and sign the transaction
    const transaction = {
      to: TaskContractAddress,
      from: account.address,
      data: txData,
      gas,
      gasPrice,
    }

    console.log('Sending transaction...')
    const signedTx = await web3.eth.accounts.signTransaction(
      transaction,
      process.env.PRIVATE_KEY,
    )

    // Send the signed transaction
    const receipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction,
    )

    console.log('Task with id', id, 'updated:', receipt.transactionHash)
    res.status(HttpStatus.StatusCodes.OK).json({ result: Results.SUCCESS })
  } catch (error) {
    console.error(error)
    res
      .status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: Results.INTERNAL_SERVER_ERROR })
  }
}

/**
 *
 * @param {String} req.params.id - id of task to toggle status
 * @param {String} - Result of the operation
 */
exports.toggleTodoStatus = async (req, res, next) => {
  try {
    const taskId = req.params.id
    const userAddress = req.userAddress

    if (!taskId || !userAddress) {
      throw new Error('Task ID or userAddress not provided')
    }

    const tx = taskContract.methods.toggleTodoStatus(taskId, userAddress)

    // Estimate gas for the transaction
    const gas = await tx.estimateGas({ from: account.address })

    // Get the gas price
    const gasPrice = await web3.eth.getGasPrice()

    // Encode the transaction data
    const txData = tx.encodeABI()

    // Create and sign the transaction
    const transaction = {
      to: TaskContractAddress,
      from: account.address,
      data: txData,
      gas,
      gasPrice,
    }

    console.log('Sending transaction...')
    const signedTx = await web3.eth.accounts.signTransaction(
      transaction,
      process.env.PRIVATE_KEY,
    )

    // Send the signed transaction
    const receipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction,
    )

    console.log('Task status updated:', receipt.transactionHash)
    res.status(HttpStatus.StatusCodes.OK).json({ message: Results.SUCCESS })
  } catch (error) {
    console.error(error)
    res
      .status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: Results.INTERNAL_SERVER_ERROR })
  }
}

/**
 *
 * @param {String} req.params.id - id of task to be deleted
 * @param {String} - Result of the operation
 */
exports.deleteTodo = async (req, res, next) => {
  try {
    const taskId = req.params.id
    const userAddress = req.userAddress

    if (!taskId || !userAddress) {
      throw new Error('Task ID or userAddress not provided')
    }

    const tx = taskContract.methods.deleteTask(taskId, userAddress)

    // Estimate gas for the transaction
    const gas = await tx.estimateGas({ from: account.address })

    // Get the gas price
    const gasPrice = await web3.eth.getGasPrice()

    // Encode the transaction data
    const txData = tx.encodeABI()

    // Create and sign the transaction
    const transaction = {
      to: TaskContractAddress,
      from: account.address,
      data: txData,
      gas,
      gasPrice,
    }

    console.log('Sending transaction...')
    const signedTx = await web3.eth.accounts.signTransaction(
      transaction,
      process.env.PRIVATE_KEY,
    )

    // Send the signed transaction
    const receipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction,
    )

    console.log('Task deleted:', receipt.transactionHash)
    res.status(HttpStatus.StatusCodes.OK).json({ message: Results.SUCCESS })
  } catch (error) {
    console.error(error)
    res
      .status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: Results.INTERNAL_SERVER_ERROR })
  }
}

/**
 * Middleware function to get Todos for a user
 * @returns {Array} List of Todos
 */
exports.getTodos = async (req, res, next) => {
  try {
    const userAddress = req.userAddress

    if (!userAddress) {
      throw new Error('User address not provided')
    }
    const userTasks = await taskContract.methods
      .getUserTasks(userAddress)
      .call()

    const todos = userTasks.map((task) => ({
      id: task.id.toString(),
      task: task.taskText,
      completed: task.completed,
      isEditing: false,
    }))

    res.status(HttpStatus.StatusCodes.OK).json(todos)
  } catch (error) {
    console.error(error)
    res
      .status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: Results.INTERNAL_SERVER_ERROR })
  }
}
