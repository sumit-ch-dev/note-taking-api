const express = require('express')
const router = express.Router()
const { register, login } = require('../../controllers/authController')
const { registrationValidationRules, loginValidationRules, validate } = require('../../middleware/authMiddleware')

router.post('/login', loginValidationRules(), validate, login)
router.post('/register', registrationValidationRules(), validate, register)

module.exports = router