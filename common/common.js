var fs     = require('fs');
var path   = require('path');
var crypto = require('crypto');
var minifier = require('node-minify');
var log    = require('../log.js');

var hashPassword = function(password){
    return new Promise(function(resolve, reject){
        var salt = crypto.randomBytes(16).toString('base64');
        var iterations = 10000;
        var hash = null;
        crypto.pbkdf2(password, salt, iterations, 512, 'sha256',
            function(err, key) {
                if (err) throw err;
                hash = (key.toString('hex'));

                var ret = {
                    hashedPassword: hash,
                    iterations: iterations,
                    salt: salt
                };

                resolve(ret)
            });
    });
};

var verifyPassword = function (savedHash, savedSalt, savedIterations, passwordAttempt) {
    return new Promise(function(resolve, reject){
        crypto.pbkdf2(passwordAttempt, savedSalt, savedIterations, 512, 'sha256',
            function(err, key){
                if (err) throw err;
                hash = (key.toString('hex'));

                resolve(savedHash == hash);
            });
    });
};

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    if ('OPTIONS' === req.method) {
        res.sendStatus(200);
    } else {
        next();
    }
};

var fileNames = [];
function fromDir(startPath,filter,skipFilter){

    if (!fs.existsSync(startPath)){
        console.log("no dir ",startPath);
        return;
    }

    var files=fs.readdirSync(startPath);
    for(var i=0;i<files.length;i++){
        var filename=path.join(startPath,files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()){
            fromDir(filename,filter,skipFilter); //recurse
        }
        else if (filename.indexOf(filter)>=0&&filename.indexOf(skipFilter)==-1) {
            fileNames.push(filename);
        };
    };

    return fileNames;
};

function sortArrayForAngular(arr){
    var sortedArr = [];
    var modulesArr = [];
    var othersArr = [];

    for(var i=0; i<arr.length; i++){
        var file=arr[i];
        if(file.indexOf('app.js') >= 0)
            sortedArr[0] = file;
        else if(file.indexOf('.module.js') >= 0)
            modulesArr.push(file);
        else
            othersArr.push(file);
    }
    var newArr = sortedArr.concat(modulesArr).concat(othersArr);
    return newArr;
}

function minifyJsFiles(jsFilesArray, targetFile){
    minifier.minify({
        compressor: 'uglifyjs',
        input: jsFilesArray,
        output: targetFile,
        callback: function(err, min){
            if(err) {
                log.error(err.message);
                console.error(err.message);
            }
            else {
                log.info("minification successful at " + targetFile);
                console.log('minification successful at ' + targetFile);
            }
        }
    });
}

module.exports = {
    allowCrossDomain: allowCrossDomain,
    verifyPassword: verifyPassword,
    hashPassword: hashPassword,
    minifyJsFiles: minifyJsFiles,
    sortArrayForAngular: sortArrayForAngular,
    fromDir: fromDir
};
