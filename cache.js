'use strict';

let log  = require('./log');
let NodeCache = require('node-cache');

let keys = {};

class Cache{

    static init(){
        if(!Cache.cache) {
            Cache.cache = new NodeCache({
                stdTTL: 15000,
                checkperiod: 2000
            });
            log.info('SplashData Cache initialized...');
        }
    }

    static destroy(){
        Cache.cache.flushAll();
        Cache.cache.close();
    }

    static cacheSomething(uid, value){
        return new Promise(function(resolve, reject){
            Cache.cache.set(uid, value, function(err, success){
                if(!err && success) resolve(success);
                else reject(err.message);
            })
        })
    }

    static checkCacheForSomething(uid){
        return new Promise(function(resolve, reject){
            Cache.cache.get(uid, function(err, value){
                if(err) reject(err.message);
                else resolve(value);
            })
        })
    }
}

/** DEFINE THE CACHE OBJECT AS A SINGLETON **/
let singleton = {};

const CACHE_KEY = Symbol.for('ECX.SPLASH.CACHE');

let globalSymbols = Object.getOwnPropertySymbols(global);
let hasCache      = (globalSymbols.indexOf(CACHE_KEY) > -1);

if(!hasCache){
    Cache.init();
    global[CACHE_KEY] = Cache
}

Object.defineProperty(singleton, "instance", {
    get: function(){
        return global[CACHE_KEY];
    }
});

Object.freeze(singleton);

module.exports = singleton;