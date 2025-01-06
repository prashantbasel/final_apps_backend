const mongoose = require('mongoose')
const { getFriendRequests } = require('../controllers/userControllers')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false,
        required: false
    },
    resetPasswordOTP: {
        type: Number,
        default: null
    },
    resetPasswordExpiry: {
        type: Date,
        default: null,
        required: false
    },
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users' // Reference to users collection
        }
    ],
    friendRequests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        }
    ],  

})

const User = mongoose.model('users', userSchema)
module.exports = User
