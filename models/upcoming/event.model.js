var mongoose = require('mongoose');

var EventSchema = mongoose.Schema({
    name: String,
    date: Date,
    address: String,
    prereg: String
});

module.exports = mongoose.model('Event', EventSchema, 'events');