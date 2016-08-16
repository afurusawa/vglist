var Db = require('mongodb').Db,
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    ReplSetServers = require('mongodb').ReplSetServers,
    ObjectID = require('mongodb').ObjectID,
    Binary = require('mongodb').Binary,
    GridStore = require('mongodb').GridStore,
    Grid = require('mongodb').Grid,
    Code = require('mongodb').Code,
    BSON = require('mongodb').BSONPure,
    assert = require('assert');

// Instantiate db
var db = new Db('test', new Server('localhost', 27017, {auto_reconnect: true}));

// Connect to db
db.open(function(err, db) {
    if(err) {
        console.log("Could not connected to 'test' database");
    }
    else {
        console.log("Successfully connected to 'test' db");
    }
});

// addGame()
exports.addGame = function(req, res) {
    var game = req.body;
    console.log('Adding game: ' + JSON.stringify(game, null, 4));

    var game =

    db.collection('games', function(err, collection) {
        collection.insert(wine, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
    //res.sendFile(path.join(__dirname + '/www/submission.html'));
    //res.redirect('back');
};

exports.findById = function(req, res) {

};