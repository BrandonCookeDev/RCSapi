var mongoose = require('mongoose');
var contactSchema = mongoose.Schema({
    email: String
});

module.exports = mongoose.model('Contact', contactSchema, 'contact');