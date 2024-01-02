const jwt = require('jsonwebtoken')
const HTTP_STATUS = require("../constants/statusCodes");
const Auth = require("../models/authModel");
const { sendResponse } = require('../utils/sendResponse')
const { body, validationResult } = require('express-validator')

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const auth = await Auth.findById(decoded.id)
        if (!auth) {
            return sendResponse(res, HTTP_STATUS.UNAUTHORIZED, "Invalid token");
        }
        req.user = auth
        next()
    } catch (error) {
        console.log(error)
        return sendResponse(res, HTTP_STATUS.UNAUTHORIZED, "Invalid token");
    }
}

const registrationValidationRules = () => {
    return [
        body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long').bail(),
        body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long')
    ];
}

const loginValidationRules = () => {
    return [
        body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long').bail(),
        body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long')
    ];
}

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next()
    }
    const extractedErrors = []
    // console.log(errors.array())
    errors.array().map(err => {
        extractedErrors.push({
            [err.type]: err.msg
        })
        // console.log(err)
    })
    return sendResponse(res, HTTP_STATUS.BAD_REQUEST, "Please provide all required fields", extractedErrors);
}

module.exports = {
    authMiddleware,
    registrationValidationRules,
    loginValidationRules,
    validate
}