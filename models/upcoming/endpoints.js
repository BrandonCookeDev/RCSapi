var log     = require('../../log');
var express = require('express');
var router  = express.Router();

var Event = require('./event.model');

router.route('/events/all').get(function(req, res){
    Event.get()
        .then(function(events){
            res.status(200).send(events);
        })
        .catch(function(err){
            if(err){
                log.error(err);
                res.sendStatus(500);
            }
        })
});

module.exports = function(server){
    server.use(router);
};