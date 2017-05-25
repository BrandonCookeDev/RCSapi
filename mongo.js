'use strict';

let log    = require('./log');
let format = require('util').format;
let mongo  = require('mongodb').MongoClient;

//collections
let collections = ['contact', 'team', 'tournaments', 'events', 'users'];

class Mongo{
    static init(){
        Mongo.mongoDomain = 'mongodb://';
        Mongo.mongoUser = 'bcooke91';
        Mongo.mongoPwd = 'w1nt3rSun91';
        Mongo.mongoHost = '54.202.55.198/RCSwebsite' || 'localhost/RCSwebsite';
        Mongo.mongoAuth = Mongo.mongoUser && Mongo.mongoPwd ? format("%s:%s@", Mongo.mongoUser, Mongo.mongoPwd) : '';
        Mongo.mongoUrl = format("%s%s%s", Mongo.mongoDomain, Mongo.mongoAuth, Mongo.mongoHost);
        log.info('mongo data collected: ', Mongo.mongoUrl);
    }

    /*
    static init(){
        return new Promise(function(resolve, reject){
            //connect
            mongo.connect('mongodb://localhost/RCSwebsite', function(err, db){
                if(err){ log.error(err); return reject(false); }

                collections.forEach(collectionName => {
                    db.collection(collectionName, function(err, collection){
                        if(err) {
                            log.error(err);
                            return reject(false);
                        }
                        else
                            log.info('connected to collection ' + collectionName);
                    });
                });

                resolve(true);
            });
        });
    }
    */

    static getMongoUrl(){
        return Mongo.mongoUrl;
    }
}

module.exports = Mongo;
