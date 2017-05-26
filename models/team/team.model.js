var log		 = require('../../log');
var mongoose = require('mongoose');

var modelName = 'Team';

var ResultSchema = mongoose.Schema({
	name: String,
	place: Number
});

var TeamSchema = mongoose.Schema({
	name: String,
	position: String,
	twitter: String,
	bio: String,
	picture: String,
	category: String,
	results: [ResultSchema]
});

TeamSchema.methods.insert = function(){
    let thisTeam = this;
	return new Promise(function(resolve, reject){
        thisTeam.model('Team').save(function(err, docs){
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
            return reject(err);
		})
	});
};

TeamSchema.methods.delete = function(){
    let thisTeam = this;
    return new Promise(function(resolve, reject){
        thisTeam.model('Team').findByIdAndRemove(thisTeam._id, function(err, docs){
            if(err){
                log.error(err);
                return reject(err);
            }
            return resolve();
        }).catch(function(err){
            if(err){
                log.error(err);
                return reject(err);
            }
            return reject(err);
        })
    })
};


TeamSchema.statics.getAll = function(){
    let thisTeam = this;
    return new Promise(function(resolve, reject){
        thisTeam.find(function(err, team){
            if(err){
                log.error(err);
                return reject(err);
            }

            resolve(team);
        }).catch(function(err){
            if(err){
                log.error(err);
                return reject(err);
            }
        })
    });
};

TeamSchema.statics.getById = function(id){
    let thisTeam = this;
	return new Promise(function(resolve, reject){
        thisTeam.findById({"_id": id}, function(err, docs){
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
            return reject(err);
        })
	})
};

TeamSchema.getByName = function(name){
    let thisTeam = this;
	return new Promise(function(resolve, reject){
        thisTeam.find({"name": name}, function(err, docs){
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
            return reject(err);
        })
	})
};

TeamSchema.getByCategory = function(category){
    let thisTeam = this;
    return new Promise(function(resolve, reject){
        thisTeam.find({"category": category}, function(err, docs){
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
            return reject(err);
        })
    })
};

TeamSchema.methods.update = function(){
    let thisTeam = this;
	return new Promise(function(resolve, reject){
        thisTeam.model('Team').findById(thisTeam._id, function(err, docs){
            if(err){
                log.error(err);
                return reject(err);
            }

            docs.name = thisTeam.name;
            docs.position = thisTeam.position;
            docs.twitter = thisTeam.twitter;
            docs.bio = thisTeam.bio;
            docs.picture = thisTeam.picture;
            docs.category = thisTeam.category;
            docs.results = thisTeam.results;

            docs.save(function(err, docs){
                if(err) {
                    log.error(err);
                    return res.sendStatus(500);
                }

                return res.sendStatus(200);
            })
        }).catch(function(err){
            if(err){
                log.error(err);
                return reject(err);
            }
            return reject(err);
        })
	})
};



module.exports = mongoose.model(modelName, TeamSchema, 'team');