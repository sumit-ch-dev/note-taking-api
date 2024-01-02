const mongoose = require('mongoose')

const authSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    passwordHash: {
        type: String,
        required: true,
        select: false
    }
}, { timestamps: true });

const Auth = mongoose.model('Auth', authSchema);

module.exports = Auth;
