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

router.route('/events/future').get(function(req, res){
    Event.getFutureEvents()
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

router.route('/events/range').get(function(req,res){
    var start = req.query.start;
    var end   = req.query.end;

    try{
        start = new Date(start);
        end   = new Date(end);
    } catch(err){
        log.error(err);
        res.sendStatus(500);
    }

    Event.getEventsInDateRange(start, end)
        .then(function(events){
            res.status(200).send(events)
        })
        .catch(function(err){
            if(err){
                log.error(err);
                res.sendStatus(500);
            }
        })
});

router.route('/events').put(function(req, res){
    var name = req.body.name;
    var date = req.body.date;
    var address = req.body.address;
    var prereg = req.body.prereq;

    var d;
    try{
        d = new Date(date);
    } catch(err){
        res.status(500).send('Invalid Date');
    }

    var e = new Event({
        name: name,
        date: d,
        address: address,
        prereg: prereg
    });

    e.insert()
        .then(function(event){
            res.status(200).send(event);
        })
        .catch(function(err){
            res.status(500).send(err);
        })
});

router.route('/events').delete(function(req, res){
    var event = req.body.event;

    var e = new Event(e);
    e.delete()
        .then(function(success){
            res.sendStatus(200)
        })
        .catch(function(err){
            res.status(500).send(err);
        })
});

module.exports = function(server){
    server.use(router);
};