const Auth = require("../models/authModel");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { sendResponse } = require('../utils/sendResponse')
const HTTP_STATUS = require("../constants/statusCodes");


const register = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return sendResponse(res, HTTP_STATUS.BAD_REQUEST, "Invalid username or password");
        }
        const userExists = await Auth.findOne({ username });
        if (userExists) {
            return sendResponse(res, HTTP_STATUS.BAD_REQUEST, "User already exists");
        }
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        const user = await Auth.create({ username, passwordHash });
        const response = {
            username: user.username,
            id: user._id
        }
        sendResponse(res, HTTP_STATUS.CREATED, "User created successfully", response);
    } catch (error) {
        sendResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, null, error);
    }
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return sendResponse(res, HTTP_STATUS.BAD_REQUEST, "Invalid username or password");
        }

        const auth = await Auth.findOne({ username }).select("+passwordHash")

        if (!auth) {
            return sendResponse(res, HTTP_STATUS.BAD_REQUEST, "Invalid username or password");
        }

        const isPasswordValid = await bcrypt.compare(password, auth.passwordHash);

        if (!isPasswordValid) {
            return sendResponse(res, HTTP_STATUS.BAD_REQUEST, "Invalid username or password");
        }

        const token = jwt.sign({ id: auth._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        const response = {
            token,
            user: {
                username: auth.username,
                id: auth._id
            }
        }

        sendResponse(res, HTTP_STATUS.OK, "Login successful", response);
    } catch (error) {
        console.log(error)
        sendResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, null, error);
    }
}


module.exports = { register, login }