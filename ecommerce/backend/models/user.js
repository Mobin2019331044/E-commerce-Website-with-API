const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    Name : {
        type: String,
        required: true,
    },

    username: {
        type: String,
        required: true,
    },

    bankAccount: {
        type: String,
        required: true,
    },
        
    password: {
        type: String,
        required: true,
    },
    
}, {timestap: true});

const User = mongoose.model('User', userSchema);
module.exports = User;