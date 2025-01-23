'use strict'
const HttpStatus = require('http-status-codes')
const jwt = require('jsonwebtoken')
const { Results } = require('../common/typedefs')
require('dotenv').config({ path: '.env' })

/**
 * Route middleware to validate auth token of user before they can perform any action that needs authorization
 * @param {String} req.headers.authtoken - The auth token of the user
 * @returns {Function} - Calls next function in middleware
 */
exports.validateUserAuthToken = (req, res, next) => {
  try {
    // Extract user's account address here from JWT, and attach it to req object
    const authToken = req.headers.authtoken
    if (!authToken) {
      throw new Error('Unauthenticated session. Please login again')
    }

    const authData = jwt.verify(authToken, process.env.AUTH_SECRET)
    req.userAddress = authData.userAccountAddress
    next()
  } catch (error) {
    console.error(error)
    if (error.name === 'TokenExpiredError') {
      // JWT token has expired
      console.error('JWT token has expired')
      return res
        .status(HttpStatus.StatusCodes.UNAUTHORIZED)
        .json({ error: 'Session Expired' })
    }
    return res
      .status(HttpStatus.StatusCodes.UNAUTHORIZED)
      .json({ error: 'Unauthenticated session. Please login again' })
  }
}

/**
 * Route middleware to generate JWT for user after successful login
 * @param {String} req.body.userAccountAddress - The account address of the user
 * @returns Auth token (JWT) for the user
 */
exports.generateAuthToken = (req, res, next) => {
  try {
    const userAccountAddress = req.body.userAccountAddress
    if (!userAccountAddress) {
      throw new Error('Account address not provided')
    }

    // Generate authToken
    const authToken = jwt.sign(
      { userAccountAddress },
      process.env.AUTH_SECRET,
      { expiresIn: '7d' }, // Token will expire in 7 days
    )

    return res.status(HttpStatus.StatusCodes.OK).json({
      authToken,
      result: Results.SUCCESS,
    })
  } catch (error) {
    console.error(error)
    return res
      .status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: Results.INTERNAL_SERVER_ERROR })
  }
}
