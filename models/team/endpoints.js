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
    model.insert()
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
    var updatedModel = new Team(updatedMember);
    updatedModel.update()
        .then(function(results){
            res.status(200).send(results);
        })
        .catch(function(err){
            res.status(500).send(err);
        });
});

router.route('/team').delete(function(req, res){
    var deleteMember = req.body.deleteMember;
    deleteMember.delete()
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