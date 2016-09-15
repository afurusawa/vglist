var mongoose    = require('mongoose');
var Game        = require('../models/game');
var GameList    = require('../models/gamelist');
var moment      = require('moment');
var fs = require('fs');

// GET



exports.findAll = function(req, res) {
    Game.find({}, function(err, games) {
        res.send(games);
    });
};
exports.findAllUsers = function(req, res) {
    GameList.find({}, function(err, gameList) {
        res.send(gameList);
    });
};

// Used for search functionality to return results in realtime
exports.findGameBySearch = function(req, res) {
    var searchString = req.params.searchString;
    //console.log('searching for: ' + searchString);
    Game.find({ title : new RegExp('^' + searchString + '.*', "i") }, function(err, games) {
        res.send(games);
    });
};

// TODO: rename to 'findGameById'
exports.findByGameId = function(req, res) {

    var id = req.params.id;

    Game.find({ _id : id }, function(err, game) {

        if(err) {
            res.end();
        }

        // Format img if exists
        // var img = "";
        // if(!game[0].img.data) {
        //    img = new Buffer(game[0].img.data).toString('base64');
        // }

        // Format date to MMMM DD, YYYY
        var released = moment(game[0].released).format('MMMM DD, YYYY');

        res.render('game.jade', { user : req.user, game : game[0], released : released/*, img : img*/ });
    });
};

exports.findGameListByUser = function(req, res) {
    var userId = req.params.uid;

    GameList.findOne({ userId : userId }, function(err, games) {
        res.send(gamelist.gameList); // the array only
    });
};


exports.findMyGameList = function(req, res) {

    if (req.user == 'undefined') {
        res.end();
    }

    GameList.find({ userId : req.user._id }, function(err, games) {
        if (err) {
            res.end();
        }
        res.send(games);
    });
};

// TODO: rename to 'findMyGameById'
// Find a single game from your game list
exports.findGameFromUser = function(req, res) {
    //var userId = req.params.uid;
    var gameId = req.params.gid;

    //console.log(gameId);

    GameList.findOne({
        $and: [
            { userId : req.user._id },
            { 'gameList.gameId': mongoose.Types.ObjectId(gameId) }
        ]
    },
    function(err, game) {

        if(!game) {
            game = 0;
            console.log("change to" + game);
            res.send(game);
        }
        else {
            //send only the pertaining game in gameList
            for (var i = 0; i < game.gameList.length; i++) {
                //console.log("iterating: " + game.gameList[i].gameId + " == " + mongoose.Types.ObjectId(gameId));
                if(game.gameList[i].gameId == gameId) {
                    //console.log("found it~");

                    //console.log("sending " + game.gameList[i]);
                    res.send(game.gameList[i]);
                }
            }
        }
        res.end();
    });
};

exports.findProfile = function(req, res) {
    var userId = req.params.id;

    GameList.find({ userId : userId }, function(err, gameList) {
        res.render('user-profile.jade', { user : req.user, gameList : gameList[0] });
    });
};




// POST
// addGame()
exports.addGame = function(req, res) {

    //console.log('uploading image file: ' + JSON.stringify(req.file, null, 4));
    //console.log('uploading image file: ' + JSON.stringify(req.file, null, 4));

    var post = req.body;
    console.log(JSON.parse(post.platform));

    var newGame = new Game();
    newGame.title = post.title;
    newGame.series = post.series;
    newGame.platform = JSON.parse(post.platform);
    newGame.released = post.released;
    newGame.developer = post.developer;
    newGame.publisher = post.publisher;
    //newGame.img.data = fs.readFileSync(req.file.path);
    //newGame.img.contentType = req.file.mimetype;

    newGame.save(function(err) {
        if (err)
            console.error('ERROR: could not add game');
    });

    res.redirect('back');
};


exports.removeFromGameList = function(req, res) {
    var post = req.body;

    if (!req.user) {
        console.error("Cannot remove game. You are not logged in!");
        res.end();
    }

    GameList.findOne({
        $and: [
            { userId : req.user._id },
            { 'gameList.gameId': post.gameId }
        ]
    },
    function (err, selectedGameList) {

        var oldRating = selectedGameList.gameList[0].rating;

        // Update overall game rating
        Game.findOne({ _id : post.gameId }, function(err, game) {

            console.log("hey I made it" + game);
            var numerator = (game.metadata.userRating * game.metadata.userRatingCount) - oldRating;
            var denominator = game.metadata.userRatingCount - 1;

            if (!denominator) {
                game.metadata.userRating = 0;
                game.metadata.userRatingCount = 0;
            }
            else {
                console.log(game.metadata.userRating + "*" + game.metadata.userRatingCount + "=>" + game.metadata.userRating * game.metadata.userRatingCount);
                console.log(numerator + "/" + denominator + " => " + numerator / denominator);
                game.metadata.userRating = numerator / denominator;
                game.metadata.userRatingCount--;
            }

            game.save(function (err) {
                if (err) console.log("ERROR CALCULATING RATING");
            });
        });



        // find and remove
        for(var i = 0; i < selectedGameList.gameList.length; i++) {
            console.log(post.gameId + " == " + selectedGameList.gameList[i].gameId);
            if(post.gameId == selectedGameList.gameList[i].gameId) {
                //console.log('found');
                selectedGameList.gameList.splice(i, 1);
            }
        }

        // save
        selectedGameList.save(function(err) {
            if (err) {
                console.error("could not remove from user's gamelist!!! " + err);
            }
        });
    });

    res.end();
};
exports.addToGameList = function(req, res) {

    var post = req.body;

    if (!req.user) {
        console.error("Cannot add game. You are not logged in!");
        res.end();
    }

    GameList.findOne({ userId : req.user._id }, function(err, selectedGameList) {

        // On first time usage, add if userId doesn't exist
        if (!selectedGameList) {

            // create new
            var newGameList = new GameList();
            var username = "";

            // link userId
            newGameList.userId = req.user._id;

            // link username (check if fb login or local
            if (!req.user.facebook.name) {
                username = req.user.local.username;
            }
            else {
                username = req.user.facebook.name;
            }
            newGameList.username = username;

            // add game
            newGameList.gameList.push({
                gameId   : post.gameId,
                gameName : post.gameName
            });

            // save
            newGameList.save(function(err) {
                if (err)
                    console.error('ERROR: could not add game to list, or issue creating gamelist');
            });
        }

        // NORMAL CASE: If userId does exist, then add game to gamelist
        else {

            // Precaution: catch if game already exists in the user's gamelist. This means the UI isn't disabling the 'add to list' button properly.
            GameList.findOne({
                    $and: [
                        { userId : req.user._id },
                        { 'gameList.gameId': post.gameId }
                    ]
                },
                {
                    'gameList.gameName' : 1
                },
                function(err, gameExists) {
                    if (gameExists) {
                        console.error("THIS GAME IS ALREADY IN THE LIST!!! YA DONE GOOFED: " + gameExists);
                    }
                    else {
                        // Add game to user's gamelist
                        selectedGameList.gameList.push({
                            gameId   : post.gameId,
                            gameName : post.gameName
                        });

                        // save
                        selectedGameList.save(function(err) {
                            if (err) {
                                console.error("could not save to user's gamelist!!! " + err);
                            }
                        });
                    } // end else
                });
        }
    });
    res.end();
};

exports.updateGameRating = function(req, res) {
    var post = req.body;

    console.log("updating rating - " + JSON.stringify(post, null, 4));

    // Update your rating
    GameList.findOne({
        $and: [
            { userId : req.user._id },
            { 'gameList.gameId': post.gameId }
        ]
    },
    function(err, gamelist) {
        //console.log(gamelist);
        console.log(gamelist.gameList[0].rating + "==>" + post.rating);
        //console.log(typeof gamelist.gameList[0].rating + " + " + typeof post.rating);

        var oldRating = gamelist.gameList[0].rating;
        var newRating = parseInt(post.rating);

        // Update overall game rating
        Game.findOne({ _id : post.gameId }, function(err, game) {

            console.log("hey I made it" + game);


            // Initial Case: No ratings exist, create first one
            if (!game.metadata.userRatingCount) {
                game.metadata.userRating = post.rating;
                game.metadata.userRatingCount++;

                game.save(function (err) {
                    if (err) console.log("updateGameRating: initial case error saving");
                });
            }

            // Null Case: if new rating is 0, then remove old rating and decrement count
            else if (!newRating) {
                console.log("null case");

                var numerator = (game.metadata.userRating * game.metadata.userRatingCount) - oldRating;
                var denominator = game.metadata.userRatingCount - 1;

                if (!denominator) {
                    game.metadata.userRating = 0;
                    game.metadata.userRatingCount = 0;
                }
                else {
                    console.log(game.metadata.userRating + "*" + game.metadata.userRatingCount + "=>" + game.metadata.userRating * game.metadata.userRatingCount);
                    console.log(numerator + "/" + denominator + " => " + numerator/denominator);
                    game.metadata.userRating = numerator / denominator;
                    game.metadata.userRatingCount--;
                }

                game.save(function (err) {
                    if (err) console.log("ERROR CALCULATING RATING");
                });
            }
            // If old rating is 0 and new rating is >0, add it
            else if (!oldRating && newRating) {
                console.log("old rating is 0 and new rating is >0");
                var numerator = (game.metadata.userRating * game.metadata.userRatingCount) + newRating;
                var denominator = game.metadata.userRatingCount + 1;
                console.log(game.metadata.userRating + "*" + game.metadata.userRatingCount + "=>" + game.metadata.userRating * game.metadata.userRatingCount);
                console.log(numerator + "/" + denominator + " => " + numerator/denominator);
                game.metadata.userRating = numerator / denominator;
                game.metadata.userRatingCount++;

                game.save(function (err) {
                    if (err) console.log("ERROR CALCULATING RATING");
                });
            }
            // Normal Case: recalculate the average
            else if (oldRating && newRating) {

                var diff = newRating - oldRating;
                console.log("normal case " + oldRating + " " + newRating);
                var numerator = (game.metadata.userRating * game.metadata.userRatingCount) + diff;
                var denominator = game.metadata.userRatingCount;
                console.log(game.metadata.userRating + "*" + game.metadata.userRatingCount + "=>" + game.metadata.userRating * game.metadata.userRatingCount);
                console.log(numerator + "/" + denominator + " => " + numerator/denominator);
                game.metadata.userRating = numerator / denominator;

                game.save(function (err) {
                    if (err) console.log("ERROR CALCULATING RATING");
                });
            }
            else {
                console.error("UNEXPECTED RATING CALCULATIONS ABORT ABORT ABORT");
            }

        });



        //send only the pertaining game in gameList
        for (var i = 0; i < gamelist.gameList.length; i++) {
            //console.log("iterating: " + game.gameList[i].gameId + " == " + mongoose.Types.ObjectId(gameId));
            if(gamelist.gameList[i].gameId == post.gameId) {
                console.log("found it~");

                previousRating = gamelist.gameList[i].rating;
                // change rating
                gamelist.gameList[i].rating = post.rating;
            }
        }

        gamelist.save(function (err) {
            if (err) console.log("ERROR CHANGING THE RATING");
        });
    });


    res.end();
};

exports.updateHoursPlayed = function(req, res) {
    var post = req.body;
    GameList.findOne({
        $and: [
            { userId : req.user._id },
            { 'gameList.gameId': post.gameId }
        ]
    },
    function(err, game) {
        console.log(game);
        console.log(game.gameList[0].hoursPlayed + "==>" + post.hoursPlayed);

        //send only the pertaining game in gameList
        for (var i = 0; i < game.gameList.length; i++) {
            //console.log("iterating: " + game.gameList[i].gameId + " == " + mongoose.Types.ObjectId(gameId));
            if(game.gameList[i].gameId == post.gameId) {
                console.log("found it~");

                // change rating
                game.gameList[i].hoursPlayed = post.hoursPlayed;
            }
        }

        game.save(function (err) {
            if (err) console.log("ERROR CHANGING THE HOURS PLAYED");
            res.end();
        });
    });
};

exports.toggleCompleted = function(req, res) {
    var post = req.body;
    var completed = JSON.parse(post.completed);

    GameList.findOne({
        $and: [
            { userId : req.user._id },
            { 'gameList.gameId': post.gameId }
        ]
    },
    function(err, game) {
        console.log(game);

        //send only the pertaining game in gameList
        for (var i = 0; i < game.gameList.length; i++) {
            //console.log("iterating: " + game.gameList[i].gameId + " == " + mongoose.Types.ObjectId(gameId));
            if(game.gameList[i].gameId == post.gameId) {
                console.log("found it~");

                // change complete
                game.gameList[i].completed = completed;
            }
        }

        game.save(function (err) {
            if (err) console.log("ERROR CHANGING COMPLETION");
            res.end();
        });
    });
};

exports.toggleNowPlaying = function(req, res) {
    var post = req.body;
    var playingNow = JSON.parse(post.playingNow);
    console.log(playingNow);

    GameList.findOne({
        $and: [
            { userId : req.user._id },
            { 'gameList.gameId': post.gameId }
        ]
    },
    function(err, game) {
        console.log(game);

        //send only the pertaining game in gameList
        for (var i = 0; i < game.gameList.length; i++) {
            //console.log("iterating: " + game.gameList[i].gameId + " == " + mongoose.Types.ObjectId(gameId));
            if(game.gameList[i].gameId == post.gameId) {
                console.log("found it~");

                // change complete
                game.gameList[i].playingNow = playingNow;
            }
        }

        game.save(function (err) {
            if (err) console.log("ERROR CHANGING COMPLETION");
            res.end();
        });
    });
};