var express = require('express');
var router  = express.Router();
var app     = express();

var log     = require('../../log');
var Team    = require('./team.model');

router.route('/team/:category').get(function(req, res){
    var cat = req.params.category;
    var team = [];

    Team.getByCategory(cat)
        .then(function(members){
            res.status(200).send(members);
        })
        .catch(function(err){
            log.error(err);
            return res.sendStatus(500);
        })
});

router.route('/team').put(function(req, res){
    var newMember = req.body.newMember;
    var model = new Team(newMember);
    Team.create(model)
        .then(function(success){
            if(success == true)
                res.sendStatus(200);
            else res.sendStatus(500);
        })
        .catch(function(err){
            log.error(err);
            return res.sendStatus(500);
        })
});

router.route('/team').post(function(req, res){
    var updatedMember = req.body.updatedMember;
    Team.findById(updatedMember.id, function(err, docs){
        if(err) {
            log.error(err);
            return res.sendStatus(500);
        }

        docs.name = updatedMember.name;
        docs.position = updatedMember.position;
        docs.twitter = updatedMember.twitter;
        docs.bio = updatedMember.bio;
        docs.picture = updatedMember.picture;
        docs.category = updatedMember.category;
        docs.results = updatedMember.results;

        docs.save(function(err, docs){
            if(err) {
                log.error(err);
                return res.sendStatus(500);
            }

            return res.sendStatus(200);
        })

    }).then(function(){
        return res.sendStatus(200);
    }).catch(function(err){
        if(err) {
            log.error(err);
            return res.sendStatus(500);
        }
    })
});

router.route('/team').delete(function(req, res){
    var deleteMember = req.body.deleteMember;
    Team.delete(deleteMember)
        .then(function(success){
            if(success==true)
                res.sendStatus(200);
            else res.sendStatus(500);
        })
        .catch(function(err){
            log.error(err);
            res.sendStatus(500);
        })
});

module.exports = function(server){
    server.use(router);
};