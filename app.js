var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var assert = require('assert');
var MongoClient = require('mongodb').MongoClient;

var index = require('./routes/index');

var app = express();

var mongo_pw = process.env.MONGO_PW;

var url = 'mongodb://branden:' + mongo_pw + '@localhost:27017/places?authSource=admin';
  MongoClient.connect(url , function(err, db) {
    assert.equal(null, err);
    console.log('connected to MongoDB');


    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'hbs');

    // uncomment after placing your favicon in /public
    //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    app.use('/', function(req, res, next){
        req.db = db;
        // helper function for lowercase a word or group of words in a sentence

        req.lowerCaseWords = function lowerCaseWords(word){
            var words = word.split(" ");
            var lowerCaseWords = '';
            words.forEach(function(s){
                lowerCaseWords += s.toLowerCase() + ' ';
            });
            return lowerCaseWords.trim();
        };
        next();
    });

    app.use('/', index);

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // error handler
    app.use(function(err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });

});
module.exports = app;
