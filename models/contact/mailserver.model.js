var mongoose = require('mongoose');
var mailserverSchema = mongoose.Schema({
    type: String,
    mailserver: String
});

module.exports = mongoose.model('MailServer', mailserverSchema, 'contact');