const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    profileImage: {
        data: Buffer,
        contentType: String,
    },
    name: {type: String},
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
});


module.exports = mongoose.model('User', userSchema);