var express = require('express');
var app     = express();
var api     = require('./api');
var log     = require('./log');

api.listen(8000);
log.info('API now listening on port 8000');