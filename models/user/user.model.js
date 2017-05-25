var mongoose = require('mongoose');
var UsersSchema = mongoose.Schema({
    name: String,
    hashedPassword: String,
    iterations: Number,
    salt: String
});

module.exports = mongoose.model('User', UsersSchema, 'users');