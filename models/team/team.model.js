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

var TeamModel = mongoose.model(modelName, TeamSchema, 'team');

TeamModel.getAll = function(){
    return new Promise(function(resolve, reject){
        TeamModel.find(function(err, team){
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

TeamModel.create = function(newTeamMember){
	return new Promise(function(resolve, reject){
        newTeamMember.save(function(err, docs){
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

TeamModel.delete = function(member){
    return new Promise(function(resolve, reject){
        TeamModel.findByIdAndRemove(member.id, function(err, docs){
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

TeamModel.getById = function(id){
	return new Promise(function(resolve, reject){
        TeamModel.findById({"_id": id}, function(err, docs){
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

TeamModel.getByName = function(name){
	return new Promise(function(resolve, reject){
        TeamModel.find({"name": name}, function(err, docs){
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

TeamModel.getByCategory = function(category){
    return new Promise(function(resolve, reject){
        TeamModel.find({"category": category}, function(err, docs){
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

TeamSchema.statics.update = function(updatedMember){
	return new Promise(function(resolve, reject){
        TeamModel.findById(updatedMember.id, function(err, docs){
            if(err){
                log.error(err);
                return reject(err);
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
        }).catch(function(err){
            if(err){
                log.error(err);
                return reject(err);
            }
            return reject(err);
        })
	})
};



module.exports = TeamModel;