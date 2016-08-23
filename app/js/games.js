
var Game = require('../models/game');
var GameList = require('../models/gamelist');


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

exports.findGamesByUser = function(req, res) {
    GameList.find({ userId : req.user._id }, function(err, games) {
        res.send(games);
    });
};

exports.findByGameId = function(req, res) {
    var id = req.params.id;
    console.log('retrieving game: ' + id);
    Game.find({ _id : id }, function(err, game) {
        console.log(game);
        res.render('game.jade', { user : req.user, game : game[0] });
    })
};

exports.findGameBySearch = function(req, res) {
    var searchString = req.params.searchString;
    console.log('searching for: ' + searchString);
    Game.find({ title : new RegExp('^' + searchString + '.*', "i") }, function(err, games) {
       res.send(games);
    });
}

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

            // link userId
            newGameList.userId = req.user._id;

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


exports.findProfile = function(req, res) {
};