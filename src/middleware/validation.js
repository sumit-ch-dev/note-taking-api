const { sendResponse } = require('../utils/sendResponse');
const HTTP_STATUS = require('../constants/statusCodes')
const { body, param, validationResult } = require('express-validator');

const noteValidationRules = () => {
    return [
        body('title').isLength({ min: 3 }).withMessage('Title must be at least 3 characters long').bail(),
        body('content').isLength({ min: 5 }).withMessage('Content must be at least 5 characters long')
    ];
}

const validateNoteId = () => {
    return [
        param('id').trim().isMongoId().withMessage('Invalid ID').bail(),
    ]
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
    noteValidationRules,
    validateNoteId,
    validate,
}

