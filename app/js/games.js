//var Db = require('mongodb').Db,
//    MongoClient = require('mongodb').MongoClient,
//    Server = require('mongodb').Server,
//    ReplSetServers = require('mongodb').ReplSetServers,
//    ObjectID = require('mongodb').ObjectID,
//    Binary = require('mongodb').Binary,
//    GridStore = require('mongodb').GridStore,
//    Grid = require('mongodb').Grid,
//    Code = require('mongodb').Code,
//    BSON = require('mongodb').BSONPure,
//    assert = require('assert');
//
//var dbname = "vglist";
//
//// Instantiate db
//var db = new Db(dbname, new Server('localhost', 27017, {auto_reconnect: true}));
//
//// Connect to db
//db.open(function(err, db) {
//    if(err) {
//        console.log("Could not connected to '" + dbname + "' database");
//    }
//    else {
//        console.log("Successfully connected to '" + dbname + "' db");
//    }
//});

var Game = require('../models/game');

// addGame()
exports.addGame = function(req, res) {

    var post = req.body;

    var newGame = new Game();
    newGame.title = post.title;
    newGame.series = post.series;
    //newGame.platform = post.platform;
    //newGame.released = new Date(post.released);
    newGame.developer = post.developer;
    newGame.publisher = post.publisher;

    newGame.save(function(err) {
        if (err)
            console.error('ERROR: could not add game');
    });

    res.redirect('back');
};

exports.findAll = function(req, res) {

    Game.find({}, function(err, games) {
        res.send(games);
    });

};