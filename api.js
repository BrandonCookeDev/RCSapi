var log = require('./log.js');

var _           = require('lodash');
var wreck       = require('wreck');
var bodyParser 	= require('body-parser');
var mongoose	= require('mongoose');
var format      = require('util').format;
var common      = require('./common/common');

var Cache       = require('./cache').instance;
var Team        = require('./models/team/team.model');
var Contact     = require('./models/contact/contact.model');
var Events      = require('./models/upcoming/event.model');
var User        = require('./models/user/user.model');
var Tournaments = require('./models/tournaments/tournament.model');
var Mailer      = require('./components/emailer');
var Mongo       = require('./mongo');

Mongo.init();
var mongoUrl = Mongo.getMongoUrl();
mongoose.connect(mongoUrl);
mongoose.connection.on('error', function(err){
    if(err){
        log.error(err.message);
        log.error(err.stack);
        console.error('Mongoose error: ' + err.message);
        process.exit(7);
    }
    else {
        log.info('mongo connected!');
        console.log('mongo connected!');
    }
});

var express     = require('express');
var app     	= express();
var session     = require('express-session');

app.use(common.allowCrossDomain);
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));

app.get('/api/getS3Resource/:path', function(req, res){
    var path = req.params.path;

    uid = 'rcs--'+path;
    var cachedValue = Cache.checkCacheForSomething(uid)
        .then(function(cachedValue){
            if(!cachedValue){

                /** FETCH FROM S3 **/
                var s3url = 'https://s3.amazonaws.com';
                var bucketName = 'rcswebsitebucket';
                var s3Path = _.join([s3url, bucketName, path], '/');

                wreck.get(s3Path, {}, function(err, s3Res, data){
                    if(err){
                        log.error(err.stack);
                        res.send(500);
                    }

                    Cache.cacheSomething(uid, data);

                    log.info('Sending Resource: ' + path);
                    return res.end(data, 'binary');
                })

            }
            else return res.end(cachedValue, 'binary');
        });
});

app.post('/api/contact/mail', function(req, res){
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var sender = req.body.sender;
    var message = req.body.message;

    emails = [];
    Contact.find({}).lean().exec(function(err, docs){
        if(err) log.error(err.message);
        else log.info(docs);

        docs.forEach(function(email){
            emails.push(email);
        })
    })
    .then(function(){
        var receivers = '';
        emails.forEach(function(email){
            receivers += email.email + ',';
        });
        Mailer.sendMail(firstName, lastName, sender, receivers, message, res);
    })
});

app.get('/api/events/:all', function(req, res){
    var getAll = req.params.all;

    var date = new Date();
    var endDate = null;

    var events = [];
    if(getAll && getAll == "true"){
        log.info('Getting ALL events');
        Events.find().lean().exec(function (err, docs) {
            if (err) {
                log.error(err.message);
                res.sendStatus(500);
                return res;
            }

            log.info(docs);
            docs.forEach(function (event) {
                events.push(event)
            })
        })
        .then(function () {
            log.info(events);
            res.json(events);
        })
    }
    else{
        log.info('Getting all Future events');
        Events.find({"date": {$gte: date}}).lean().exec(function (err, docs) {
            if (err) {
                log.error(err.message);
                res.sendStatus(500);
                return res;
            }

            log.info(docs);
            docs.forEach(function (event) {
                events.push(event)
            })
        })
        .then(function () {
            log.info(events);
            res.json(events);
        })
    }
});

app.get('/api/events', function(req, res){
    var date = new Date();
    var endDate = null;

    log.info('Fetching all future events');

    var events = [];
    Events.find({"date": {$gte: date}}).lean().exec(function (err, docs) {
        if (err) log.error(err.message);
        else log.info(docs);

        docs.forEach(function (event) {
            events.push(event)
        })
    })
    .then(function () {
        log.info(events);
        res.json(events);
    })
});

app.delete('/api/events/:id', function(req, res){
    var id = req.params.id;
    log.warn('Attempting to delete event: ' + id);

    Events.find({'_id':id}).remove(function(err){
        if(err){
            log.error(err.message);
            res.sendStatus(500);
            return res;
        }

        log.info('Successfully Deleted Event');
        res.sendStatus(200);
        return res;
    })
});

app.post('/api/events', function(req, res){
    var id   = req.body._id;
    var name = req.body.name;
    var date = req.body.date;
    var addr = req.body.address;
    var prereg = req.body.prereg;

    log.info("Altering the event: " + id);

    Events.findOne({'_id': id.toString()}, function(err, event){
        if(err){
            log.error(err.message);
            res.sendStatus(500);
            return res;
        }

        event.name = name;
        event.date = date;
        event.address = addr;
        event.prereg = prereg;

        event.save(function(err, event){
            if(err){
                log.error(err.message);
                res.sendStatus(500);
                return res;
            }
            else{
                log.info('Event altered successfully!');
                res.sendStatus(200);
                return res;
            }
        });
    })
});

app.put('/api/events', function(req, res){
    var name = req.body.name;
    var date = req.body.date;
    var addr = req.body.addr;
    var prereg = req.body.prereg;

    var e = new Events({
        name: name,
        date: date,
        address: addr,
        prereg: prereg
    });

    e.save(function(err, event){
        if(err){
            log.error(err.message);
            res.send(400);
        }
        log.info('Successfully saved event! \n' + event.toString());
        res.send(200);
    })
});

app.get('/api/events/:date', function(req, res){
    var dateStr = req.params.date;
    var dateRegex = new Regex("/^\d{2}-\d{2}-\d{4}$/");

    if(!dateStr.match(dateRegex)){
        //TRY TO FORMAT
    }

    var date = new Date(Date.parse(dateStr));
    var endDate = null;

    if(!date)
        date = new Date();

    var events = [];
    Events.find({ "date" : { $gte : date }}).lean().exec(function(err, docs){
        if(err) log.error(err.message);
        else log.info(docs);

        docs.forEach(function(event){
            events.push(event)
        })
    })
    .then(function(){
        res.json(events);
    })
});

app.get('/api/tournaments/:name', function(req, res){
    var name = req.params.name;

    Tournaments.Tournament.findOne({"name":name}).lean().exec(function(err, docs){
        if(err) log.error(err.message);
        else log.info(docs);

        res.json(docs);
    })
});

app.get('/api/user/:name', function(req, res){
    var uname = req.params.name;

    var user = null;
    User.find({'name':uname}).lean().exec(function(err, docs){
        if(err) {
            log.error(err.message);
            res.sendStatus(403);
            return;
        }

        user = docs[0];
    })
    .then(function(){
        //TODO fix this so it doesn't expose the user's hash or salt.
        //res.json(user);
    })
});

app.post('/api/user/login', function(req, res){
    var uname = req.body.uname;
    var upass  = req.body.upass;

    log.info('Attempting login for account: ' + uname);

    var user = null;
    User.find({'name':uname}).lean().exec(function(err, docs){
        if(err){
            log.error(err.message);
            res.sendStatus(403);
            return res;
        }

        log.info('Found user. Password check next');
        user = docs[0];
        if(!user){
            res.send('User not in the db', 400);
        }
    })
    .then(function(){
        common.verifyPassword(user.hashedPassword, user.salt, user.iterations, upass)
            .then(function(isAuthorized){
                if(isAuthorized){
                    log.info('Login Success...');
                    req.session.user = user.name;
                    req.session.admin = true;
                    res.json(user.name);
                    res.end();
                    return res;
                }
                else {
                    log.warn('Login Failed...');
                    res.sendStatus(403);
                    return res;
                }
            })
    })
});

app.delete('/api/user/logout', function(req, res){
    req.session.destroy();
    res.send("logout success!");
});

require('./models/team/endpoints')(app);

module.exports = app;
