const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: true
    },

    message: {
        type: String,
        required: true
    },

    date: {
        type: String,
        required: true
    },

    time: {
        type: String,
        required: true
    },

    fullTimestamp: {
        type: Date,
        default: Date.now
    },

    socketId: {
        type: String,
        required: true
    },

    ipAddress: {
        type: String
    }
});

module.exports = mongoose.model('Message', messageSchema);