'use strict';

var log      = require('../../log');
var mongoose = require('mongoose');

var EventSchema = mongoose.Schema({
    name: String,
    date: Date,
    address: String,
    prereg: String
});

EventSchema.methods.insert = function(){
    let thisEvent = this;
    return new Promise(function(resolve,reject){
        thisEvent.model('Event').save(function(err, docs){
            if(err){
                log.error(err);
                return reject(err);
            }

            resolve(docs);
        })
    }).catch(function(err){
        if(err){
            log.error(err);
            return reject(err);
        }
        return reject();
    })
};


EventSchema.methods.delete = function(){
    let thisEvent = this;
    return new Promise(function(resolve, reject){
        thisEvent.model('Event').removeById(this.id, function(err, success){
            if(err){
                log.error(err);
                return reject(err);
            }

            return resolve(sucess);
        }).catch(function(err){
            if(err){
                log.error(err);
                return reject(err);
            }
            return reject();
        })
    })
};


EventSchema.statics.get = function(){
    let thisEvent = this;
    return new Promise(function(resolve, reject){
        thisEvent.find(function(err, docs){
            if(err){
                log.error(err);
                return reject(err);
            }

            resolve(docs);
        }).catch(function(err){
            if(err){
                log.error(err);
                return reject(err);
            }
            return reject();
        })
    });
};

EventSchema.statics.getFutureEvents = function(){
    let thisEvent = this;
    return new Promise(function(resolve, reject) {
        thisEvent.find({"date": {$gte: new Date(Date.now())}}, function (err, docs) {
            if (err) {
                log.error(err);
                return reject(err);
            }

            return resolve(docs);
        }).catch(function (err) {
            if (err) {
                log.error(err);
                return reject(err);
            }
            return reject();
        })
    });
};

EventSchema.statics.getEventsInDateRange = function(start, end){
    let thisEvent = this;
    return new Promise(function(resolve, reject){
        thisEvent.find({"date": {$gte: start, $lte: end}}, function(err, docs){
            if(err){
                log.error(err);
                return reject(err);
            }

            return resolve(docs);
        }).catch(function(err){
            if(err){
                log.error(err);
                return reject(err);
            }
            return reject();
        })
    })
};

EventSchema.statics.getEventByName = function(name){
    let thisEvent = this;
    return new Promise(function(resolve, reject){
        thisEvent.find({"name": name}, function(err, docs){
            if(err){
                log.error(err);
                return reject(err);
            }

            return resolve(docs);
        }).catch(function(err){
            if(err){
                log.error(err);
                return reject(err);
            }
            return reject();
        })
    })
};

module.exports = mongoose.model('Event', EventSchema, 'events');